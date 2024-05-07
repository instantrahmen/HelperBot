/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("le770j2rzt4qb24")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lo1fayea",
    "name": "name",
    "type": "text",
    "required": false,
    "presentable": true,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "2ypyy6rp",
    "name": "data",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("le770j2rzt4qb24")

  // remove
  collection.schema.removeField("lo1fayea")

  // remove
  collection.schema.removeField("2ypyy6rp")

  return dao.saveCollection(collection)
})
