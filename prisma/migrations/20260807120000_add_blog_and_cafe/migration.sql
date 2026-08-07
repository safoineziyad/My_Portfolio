-- CreateTable
CREATE TABLE "blog_posts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "blog_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BlogPostToBlogTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "cafe_menu_items" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "price" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT '',
    "isPopular" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "cafe_menu_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cafe_orders" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "specialInstructions" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "paymentMethod" TEXT NOT NULL DEFAULT 'cash',
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "total" DOUBLE PRECISION NOT NULL,
    "createdAt" TEXT NOT NULL,

    CONSTRAINT "cafe_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cafe_order_items" (
    "id" TEXT NOT NULL,
    "menuItemId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "priceAtTime" DOUBLE PRECISION NOT NULL,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "cafe_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cafe_reservations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "guests" INTEGER NOT NULL,
    "specialRequests" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TEXT NOT NULL,

    CONSTRAINT "cafe_reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cafe_contact_messages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,

    CONSTRAINT "cafe_contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "blog_posts"("slug");

-- CreateIndex
CREATE INDEX "blog_posts_published_idx" ON "blog_posts"("published");

-- CreateIndex
CREATE INDEX "blog_posts_createdAt_idx" ON "blog_posts"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "blog_tags_name_key" ON "blog_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_BlogPostToBlogTag_AB_unique" ON "_BlogPostToBlogTag"("A", "B");

-- CreateIndex
CREATE INDEX "_BlogPostToBlogTag_B_index" ON "_BlogPostToBlogTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "cafe_orders_orderNumber_key" ON "cafe_orders"("orderNumber");

-- AddForeignKey
ALTER TABLE "_BlogPostToBlogTag" ADD CONSTRAINT "_BlogPostToBlogTag_A_fkey" FOREIGN KEY ("A") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogPostToBlogTag" ADD CONSTRAINT "_BlogPostToBlogTag_B_fkey" FOREIGN KEY ("B") REFERENCES "blog_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cafe_order_items" ADD CONSTRAINT "cafe_order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "cafe_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
