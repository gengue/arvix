package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2648271836")
		if err != nil {
			return err
		}

		// update field
		if err := collection.Fields.AddMarshaledJSONAt(3, []byte(`{
			"hidden": false,
			"id": "file3150104748",
			"maxSelect": 1,
			"maxSize": 10000000,
			"mimeTypes": [
				"image/png",
				"image/vnd.mozilla.apng",
				"image/jpeg",
				"image/webp"
			],
			"name": "img",
			"presentable": false,
			"protected": false,
			"required": true,
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
		collection, err := app.FindCollectionByNameOrId("pbc_2648271836")
		if err != nil {
			return err
		}

		// update field
		if err := collection.Fields.AddMarshaledJSONAt(3, []byte(`{
			"hidden": false,
			"id": "file3150104748",
			"maxSelect": 1,
			"maxSize": 10000000,
			"mimeTypes": [
				"image/png",
				"image/vnd.mozilla.apng",
				"image/jpeg",
				"image/webp"
			],
			"name": "img",
			"presentable": false,
			"protected": false,
			"required": true,
			"system": false,
			"thumbs": [
				"1920x1080"
			],
			"type": "file"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
