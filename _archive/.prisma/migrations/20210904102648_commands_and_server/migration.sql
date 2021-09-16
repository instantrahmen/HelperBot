/*
  Warnings:

  - You are about to drop the column `descriptoin` on the `Command` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Argument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "commandId" TEXT NOT NULL,
    FOREIGN KEY ("commandId") REFERENCES "Command" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Command" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "payloadType" TEXT NOT NULL,
    "payload" TEXT NOT NULL
);
INSERT INTO "new_Command" ("id", "name", "payload", "payloadType") SELECT "id", "name", "payload", "payloadType" FROM "Command";
DROP TABLE "Command";
ALTER TABLE "new_Command" RENAME TO "Command";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
