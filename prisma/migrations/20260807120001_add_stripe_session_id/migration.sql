-- AlterTable
ALTER TABLE "marketplace_orders" ADD COLUMN "stripeSessionId" TEXT;
ALTER TABLE "cafe_orders" ADD COLUMN "stripeSessionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_orders_stripeSessionId_key" ON "marketplace_orders"("stripeSessionId");
CREATE UNIQUE INDEX "cafe_orders_stripeSessionId_key" ON "cafe_orders"("stripeSessionId");
