-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cluster" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "token" TEXT,
    "registrationId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "nodes" INTEGER,
    "score" INTEGER,
    "lastSeen" DATETIME,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Cluster_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Cluster" ("createdAt", "id", "lastSeen", "name", "nodes", "registrationId", "score", "status", "token", "updatedAt", "userId", "version") SELECT "createdAt", "id", "lastSeen", "name", "nodes", "registrationId", "score", "status", "token", "updatedAt", "userId", "version" FROM "Cluster";
DROP TABLE "Cluster";
ALTER TABLE "new_Cluster" RENAME TO "Cluster";
CREATE UNIQUE INDEX "Cluster_token_key" ON "Cluster"("token");
CREATE UNIQUE INDEX "Cluster_registrationId_key" ON "Cluster"("registrationId");
CREATE TABLE "new_OrphanedResource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clusterId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "namespace" TEXT,
    "uid" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "discoveredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME,
    "owner" TEXT,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    CONSTRAINT "OrphanedResource_clusterId_fkey" FOREIGN KEY ("clusterId") REFERENCES "Cluster" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_OrphanedResource" ("clusterId", "createdAt", "deletedAt", "discoveredAt", "id", "kind", "name", "namespace", "owner", "reason", "status", "uid") SELECT "clusterId", "createdAt", "deletedAt", "discoveredAt", "id", "kind", "name", "namespace", "owner", "reason", "status", "uid" FROM "OrphanedResource";
DROP TABLE "OrphanedResource";
ALTER TABLE "new_OrphanedResource" RENAME TO "OrphanedResource";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
