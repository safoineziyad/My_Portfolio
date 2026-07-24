const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Seed admin team member
  const existingAdmin = await prisma.teamMember.findUnique({
    where: { email: 'admin@ziyad.store' },
  });

  if (!existingAdmin) {
    const admin = await prisma.teamMember.create({
      data: {
        name: 'Admin',
        email: 'admin@ziyad.store',
        passwordHash: btoa('admin123'),
        role: 'admin',
        isActive: true,
      },
    });
    console.log('Admin created:', admin.email);
  } else {
    console.log('Admin already exists:', existingAdmin.email);
  }

  // Seed a manager
  const existingManager = await prisma.teamMember.findUnique({
    where: { email: 'manager@ziyad.store' },
  });

  if (!existingManager) {
    const manager = await prisma.teamMember.create({
      data: {
        name: 'Manager',
        email: 'manager@ziyad.store',
        passwordHash: btoa('manager123'),
        role: 'manager',
        isActive: true,
      },
    });
    console.log('Manager created:', manager.email);
  }

  // Seed marketplace categories
  const categories = [
    { name: 'Electronics', slug: 'electronics', icon: 'Smartphone' },
    { name: 'Clothing', slug: 'clothing', icon: 'Shirt' },
    { name: 'Home & Garden', slug: 'home-garden', icon: 'Home' },
    { name: 'Sports', slug: 'sports', icon: 'Dumbbell' },
    { name: 'Books', slug: 'books', icon: 'BookOpen' },
    { name: 'Beauty', slug: 'beauty', icon: 'Sparkles' },
  ];

  for (const cat of categories) {
    const existing = await prisma.marketplaceCategory.findUnique({
      where: { slug: cat.slug },
    });
    if (!existing) {
      await prisma.marketplaceCategory.create({ data: cat });
    }
  }
  console.log('Marketplace categories seeded');

  // Seed demo marketplace users
  const existingBuyer = await prisma.user.findUnique({
    where: { email: 'buyer@demo.com' },
  });
  if (!existingBuyer) {
    await prisma.user.create({
      data: {
        name: 'Demo Buyer',
        email: 'buyer@demo.com',
        passwordHash: btoa('demo123'),
        role: 'buyer',
      },
    });
    console.log('Demo buyer created');
  }

  // Seed demo vendor
  const existingSeller = await prisma.user.findUnique({
    where: { email: 'seller@demo.com' },
  });
  let vendorUserId;
  if (!existingSeller) {
    const seller = await prisma.user.create({
      data: {
        name: 'Demo Seller',
        email: 'seller@demo.com',
        passwordHash: btoa('demo123'),
        role: 'seller',
      },
    });
    vendorUserId = seller.id;
  } else {
    vendorUserId = existingSeller.id;
  }

  const existingVendor = await prisma.vendor.findFirst({
    where: { userId: vendorUserId },
  });
  let vendorId;
  if (!existingVendor) {
    const vendor = await prisma.vendor.create({
      data: {
        businessName: 'Ziyad Tech Store',
        slug: 'ziyad-tech-store',
        description: 'Premium electronics and gadgets from Morocco',
        email: 'seller@demo.com',
        userId: vendorUserId,
        isApproved: true,
        rating: 4.5,
        responseTime: 'within 24h',
      },
    });
    vendorId = vendor.id;
    console.log('Demo vendor created');
  } else {
    vendorId = existingVendor.id;
  }

  // Seed marketplace products
  const electronicsCat = await prisma.marketplaceCategory.findUnique({ where: { slug: 'electronics' } });
  const clothingCat = await prisma.marketplaceCategory.findUnique({ where: { slug: 'clothing' } });

  const products = [
    { name: 'Wireless Headphones Pro', slug: 'wireless-headphones-pro', description: 'Premium noise-cancelling wireless headphones with 30-hour battery life.', price: 599.99, compareAtPrice: 799.99, stock: 25, vendorId, categoryId: electronicsCat?.id, status: 'active', featured: true },
    { name: 'Smart Watch Ultra', slug: 'smart-watch-ultra', description: 'Feature-packed smartwatch with health monitoring and GPS.', price: 1299.99, stock: 15, vendorId, categoryId: electronicsCat?.id, status: 'active', featured: true },
    { name: 'Mechanical Keyboard RGB', slug: 'mechanical-keyboard-rgb', description: 'Premium mechanical keyboard with RGB lighting and Cherry MX switches.', price: 449.99, compareAtPrice: 549.99, stock: 30, vendorId, categoryId: electronicsCat?.id, status: 'active' },
    { name: 'USB-C Hub 7-in-1', slug: 'usb-c-hub-7in1', description: 'Versatile USB-C hub with HDMI, USB 3.0, SD card reader, and power delivery.', price: 199.99, stock: 50, vendorId, categoryId: electronicsCat?.id, status: 'active' },
    { name: 'Moroccan Leather Backpack', slug: 'moroccan-leather-backpack', description: 'Handcrafted genuine leather backpack made by Moroccan artisans.', price: 899.99, stock: 10, vendorId, categoryId: clothingCat?.id, status: 'active', featured: true },
    { name: 'Traditional Jellaba Modern', slug: 'traditional-jellaba-modern', description: 'Modern take on the classic Moroccan jellaba, premium cotton blend.', price: 349.99, stock: 20, vendorId, categoryId: clothingCat?.id, status: 'active' },
    { name: 'Wireless Mouse Ergonomic', slug: 'wireless-mouse-ergonomic', description: 'Ergonomic wireless mouse with adjustable DPI and silent clicks.', price: 149.99, stock: 40, vendorId, categoryId: electronicsCat?.id, status: 'active' },
    { name: 'Portable Bluetooth Speaker', slug: 'portable-bluetooth-speaker', description: 'Waterproof portable speaker with 360-degree sound.', price: 299.99, compareAtPrice: 399.99, stock: 35, vendorId, categoryId: electronicsCat?.id, status: 'active' },
  ];

  for (const product of products) {
    const existing = await prisma.marketplaceProduct.findFirst({
      where: { slug: product.slug },
    });
    if (!existing) {
      await prisma.marketplaceProduct.create({ data: { ...product, images: '[]' } });
    }
  }
  console.log('Marketplace products seeded');

  // Seed platform settings
  const settings = [
    { key: 'platform_name', value: 'Ziyad Market' },
    { key: 'commission_rate', value: '0.10' },
    { key: 'contact_email', value: 'support@ziyad.market' },
  ];
  for (const s of settings) {
    await prisma.platformSetting.upsert({
      where: { key: s.key },
      create: s,
      update: { value: s.value },
    });
  }
  console.log('Platform settings seeded');

  // Seed some notifications
  const notifCount = await prisma.notification.count();
  if (notifCount === 0) {
    await prisma.notification.createMany({
      data: [
        { title: 'New Order Received', message: 'Order #ORD-001 has been placed for 2 items.', type: 'order' },
        { title: 'Low Stock Alert', message: 'Wireless Headphones Pro has only 5 units left.', type: 'stock' },
        { title: 'System Update', message: 'Platform settings have been updated.', type: 'system' },
        { title: 'New Vendor Application', message: 'A new vendor has applied to join the marketplace.', type: 'system' },
        { title: 'Dispute Opened', message: 'A dispute has been filed for order #ORD-003.', type: 'order' },
      ],
    });
    console.log('Notifications seeded');
  }

  console.log('Seed complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
