-- CreateTable
CREATE TABLE "District" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pcode" TEXT NOT NULL,
    "areaSqKm" DOUBLE PRECISION NOT NULL,
    "centerLat" DOUBLE PRECISION NOT NULL,
    "centerLon" DOUBLE PRECISION NOT NULL,
    "tagline" TEXT NOT NULL,
    "blurb" TEXT NOT NULL,

    CONSTRAINT "District_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Destination" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameNepali" TEXT,
    "category" TEXT[],
    "nearestTown" TEXT,
    "lat" DOUBLE PRECISION,
    "lon" DOUBLE PRECISION,
    "elevationM" INTEGER,
    "interestTags" TEXT[],
    "bestSeasons" TEXT[],
    "bestTimeNote" TEXT,
    "budget" TEXT NOT NULL,
    "budgetNote" TEXT,
    "hiddenGem" BOOLEAN NOT NULL,
    "hiddenGemReason" TEXT,
    "shortDescription" TEXT NOT NULL,
    "longDescription" TEXT,
    "bestFor" TEXT,
    "howToGetThere" TEXT,
    "entryFee" TEXT,
    "openingHours" TEXT,
    "nearbyStaysFood" TEXT,
    "safetyNotes" TEXT,
    "mediaPhoto" TEXT,
    "mediaPhotoUrl" TEXT,
    "mediaCredit" TEXT,
    "sources" TEXT[],
    "alternateNames" TEXT[],
    "culturalNote" TEXT,
    "verify" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Destination_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "District_slug_key" ON "District"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "District_pcode_key" ON "District"("pcode");

-- CreateIndex
CREATE INDEX "Destination_districtId_idx" ON "Destination"("districtId");

-- CreateIndex
CREATE UNIQUE INDEX "Destination_districtId_slug_key" ON "Destination"("districtId", "slug");

-- AddForeignKey
ALTER TABLE "Destination" ADD CONSTRAINT "Destination_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
