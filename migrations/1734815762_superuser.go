package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		superusers, err := app.FindCollectionByNameOrId(core.CollectionNameSuperusers)
		if err != nil {
			return err
		}

		record := core.NewRecord(superusers)

		// TODO: the values must be loaded via os.Getenv(key)
		record.Set("email", "genesisdaft@gmail.com.com")
		record.Set("name", "Genesis Guerrero")
		record.Set("password", "takeThePowerBack")

		return app.Save(record)
	}, func(app core.App) error {
		record, _ := app.FindAuthRecordByEmail(core.CollectionNameSuperusers, "test@example.com")
		if record == nil {
			return nil // probably already deleted
		}

		return app.Delete(record)
	})
}
