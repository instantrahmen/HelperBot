/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("le770j2rzt4qb24")

  // remove
  collection.schema.removeField("q2hnbjya")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fts5ghto",
    "name": "guild",
    "type": "text",
    "required": true,
    "presentable": true,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("le770j2rzt4qb24")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "q2hnbjya",
    "name": "guild",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "t92ijt8k9gdgvyq",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // remove
  collection.schema.removeField("fts5ghto")

  return dao.saveCollection(collection)
})
