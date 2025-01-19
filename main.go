package main

import (
	"encoding/json"
	"fmt"
	tpl "html/template"
	"log"
	"net/http"
	"os"
	"strings"

	// _ "github.com/gengue/arvix/migrations"

	"github.com/gengue/arvix/ui"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
	"github.com/pocketbase/pocketbase/tools/template"
)

func main() {
	app := pocketbase.New()

	// loosely check if it was executed using "go run"
	isGoRun := strings.HasPrefix(os.Args[0], os.TempDir())

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		// enable auto creation of migration files when making collection changes in the Dashboard
		// (the isGoRun check is to enable it only during development)
		Automigrate: isGoRun,
	})

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		se.Router.Bind(apis.Gzip())
		se.Router.Bind(apis.BodyLimit(80 << 20)) // 80MB
		// serves static files from the provided public dir (if exists)
		// se.Router.GET("/{path...}", apis.Static(ui.DistDirFS, true))

		registry := template.NewRegistry()

		se.Router.GET("/__hello/{slug}", func(e *core.RequestEvent) error {
			slug := e.Request.PathValue("slug")

			record, err := app.FindFirstRecordByData("projects", "slug", slug)
			if err != nil {
				return err
			}
			errs := app.ExpandRecord(record, []string{"transitions_via_project", "structures_via_project"}, nil)
			if len(errs) > 0 {
				return fmt.Errorf("failed to expand: %v", errs)
			}

			log.Println(record.Get("transitions_via_project"))
			log.Println(record.ExpandedAll("transitions_via_project"))

			j, err := json.Marshal(record)
			if err != nil {
				return fmt.Errorf("failed to marshal: %v", err)
			}

			html, err := registry.LoadFiles(
				"views/layout.html",
				"views/hello.html",
			).Render(map[string]any{
				"slug": slug,
				"json": tpl.JS(j),
			})
			if err != nil {
				// or redirect to a dedicated 404 HTML page
				return e.NotFoundError("", err)
			}

			return e.HTML(http.StatusOK, html)
		})

		se.Router.GET("/{path...}", func(c *core.RequestEvent) error {
			// Set caching headers
			c.Response.Header().Add("Cache-Control", "max-age=31536000, stale-while-revalidate=604800")

			// home route will be rendered as a template html
			if c.Request.PathValue("path") == "" {
				html, err := registry.LoadFiles(
					"views/layout.html",
					"views/index.html",
				).Render(nil)
				if err != nil {
					// or redirect to a dedicated 404 HTML page
					return c.NotFoundError("", err)
				}
				return c.HTML(http.StatusOK, html)
			}
			// Serve the file
			return apis.Static(ui.DistDirFS, true)(c)
		})

		return se.Next()
	})

	app.OnFileDownloadRequest().BindFunc(func(e *core.FileDownloadRequestEvent) error {
		e.Response.Header().Add("Cache-Control", "max-age=31536000, stale-while-revalidate=604800")
		return e.Next()
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
