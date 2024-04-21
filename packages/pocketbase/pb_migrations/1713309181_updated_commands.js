/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("le770j2rzt4qb24")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "b9mxsdpc",
    "name": "reply",
    "type": "editor",
    "required": false,
    "presentable": true,
    "unique": false,
    "options": {
      "convertUrls": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("le770j2rzt4qb24")

  // remove
  collection.schema.removeField("b9mxsdpc")

  return dao.saveCollection(collection)
})
