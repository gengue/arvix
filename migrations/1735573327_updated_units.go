package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_586599074")
		if err != nil {
			return err
		}

		// update field
		if err := collection.Fields.AddMarshaledJSONAt(8, []byte(`{
			"hidden": false,
			"id": "file1215376496",
			"maxSelect": 1,
			"maxSize": 0,
			"mimeTypes": [
				"image/png",
				"image/vnd.mozilla.apng",
				"image/jpeg",
				"image/webp",
				"image/svg+xml"
			],
			"name": "plansImg",
			"presentable": false,
			"protected": false,
			"required": false,
			"system": false,
			"thumbs": [
				"1920x1080",
				"700x394"
			],
			"type": "file"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_586599074")
		if err != nil {
			return err
		}

		// update field
		if err := collection.Fields.AddMarshaledJSONAt(8, []byte(`{
			"hidden": false,
			"id": "file1215376496",
			"maxSelect": 1,
			"maxSize": 0,
			"mimeTypes": [
				"image/png",
				"image/vnd.mozilla.apng",
				"image/jpeg",
				"image/webp",
				"image/svg+xml"
			],
			"name": "plansImg",
			"presentable": false,
			"protected": false,
			"required": false,
			"system": false,
			"thumbs": [],
			"type": "file"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
