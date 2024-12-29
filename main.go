package main

import (
	"log"
	"os"
	"strings"

	// _ "github.com/gengue/arvix/migrations"
	"github.com/gengue/arvix/ui"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
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

		se.Router.GET("/{path...}", func(c *core.RequestEvent) error {
			// Set caching headers
			c.Response.Header().Add("Cache-Control", "max-age=31536000, stale-while-revalidate=604800")

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
