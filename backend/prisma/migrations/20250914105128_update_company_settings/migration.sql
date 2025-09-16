/*
  Warnings:

  - You are about to drop the column `workHoursPerDay` on the `CompanySetting` table. All the data in the column will be lost.
  - Added the required column `endHour` to the `CompanySetting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startHour` to the `CompanySetting` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CompanySetting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startHour" INTEGER NOT NULL,
    "endHour" INTEGER NOT NULL
);
INSERT INTO "new_CompanySetting" ("id") SELECT "id" FROM "CompanySetting";
DROP TABLE "CompanySetting";
ALTER TABLE "new_CompanySetting" RENAME TO "CompanySetting";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
