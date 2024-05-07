/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "t92ijt8k9gdgvyq",
    "created": "2024-03-28 11:51:05.252Z",
    "updated": "2024-03-28 11:51:05.252Z",
    "name": "guilds",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "r7xrcx0e",
        "name": "name",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "yc0biv3u",
        "name": "guild_id",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("t92ijt8k9gdgvyq");

  return dao.deleteCollection(collection);
})
