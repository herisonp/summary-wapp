-- CreateTable
CREATE TABLE "ShippingLog" (
    "id" TEXT NOT NULL,
    "groupId" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "summary" TEXT,

    CONSTRAINT "ShippingLog_pkey" PRIMARY KEY ("id")
);
