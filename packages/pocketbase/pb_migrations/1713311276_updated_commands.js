/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("le770j2rzt4qb24")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cxf2o2h5",
    "name": "type",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 2,
      "values": [
        "slash",
        "response"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("le770j2rzt4qb24")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cxf2o2h5",
    "name": "type",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "slash",
        "response"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
