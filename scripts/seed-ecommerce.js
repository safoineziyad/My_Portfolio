const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const STORE_ID = 'store_main';

const categories = [
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Clothing', slug: 'clothing' },
  { name: 'Home & Garden', slug: 'home-garden' },
  { name: 'Sports', slug: 'sports' },
  { name: 'Books', slug: 'books' },
];

const productData = [
  { name: 'Wireless Noise-Cancelling Headphones', sku: 'ELEC-001', price: 299.99, cost: 120, stock: 156, category: 'Electronics', description: 'Premium over-ear headphones with ANC technology, 30hr battery life, and Hi-Res Audio support.' },
  { name: 'Ultra-Slim Laptop Stand', sku: 'ELEC-002', price: 49.99, cost: 15, stock: 342, category: 'Electronics', description: 'Ergonomic aluminum laptop stand with adjustable height and ventilated design.' },
  { name: 'Mechanical Keyboard RGB', sku: 'ELEC-003', price: 149.99, cost: 55, stock: 89, category: 'Electronics', description: 'Hot-swappable mechanical keyboard with per-key RGB and PBT keycaps.' },
  { name: 'Smart Fitness Watch', sku: 'ELEC-004', price: 199.99, cost: 75, stock: 214, category: 'Electronics', description: 'Advanced fitness tracker with GPS, heart rate, SpO2, and 7-day battery.' },
  { name: 'USB-C Hub 7-in-1', sku: 'ELEC-005', price: 39.99, cost: 12, stock: 478, category: 'Electronics', description: 'Multi-port USB-C hub with HDMI, USB 3.0, SD card reader, and PD charging.' },
  { name: 'Premium Cotton T-Shirt', sku: 'CLO-001', price: 34.99, cost: 8, stock: 520, category: 'Clothing', description: '100% organic cotton crew neck t-shirt, pre-shrunk with reinforced seams.' },
  { name: 'Slim Fit Denim Jeans', sku: 'CLO-002', price: 79.99, cost: 25, stock: 183, category: 'Clothing', description: 'Classic slim fit jeans with stretch comfort and faded wash finish.' },
  { name: 'Waterproof Rain Jacket', sku: 'CLO-003', price: 129.99, cost: 40, stock: 67, category: 'Clothing', description: 'Lightweight waterproof jacket with sealed seams, hood, and ventilation zips.' },
  { name: 'Merino Wool Sweater', sku: 'CLO-004', price: 89.99, cost: 30, stock: 145, category: 'Clothing', description: 'Superfine merino wool pullover sweater, naturally temperature-regulating.' },
  { name: 'Ceramic Plant Pot Set', sku: 'HOME-001', price: 44.99, cost: 12, stock: 290, category: 'Home & Garden', description: 'Set of 3 minimalist ceramic pots with drainage holes and bamboo trays.' },
  { name: 'LED Desk Lamp', sku: 'HOME-002', price: 59.99, cost: 18, stock: 198, category: 'Home & Garden', description: 'Adjustable LED desk lamp with 5 color temperatures and wireless charging base.' },
  { name: 'Memory Foam Pillow', sku: 'HOME-003', price: 69.99, cost: 20, stock: 312, category: 'Home & Garden', description: 'Contour memory foam pillow with cooling gel layer and washable cover.' },
  { name: 'Yoga Mat Premium', sku: 'SPRT-001', price: 54.99, cost: 15, stock: 234, category: 'Sports', description: 'Extra-thick 6mm TPE yoga mat with alignment lines and carrying strap.' },
  { name: 'Stainless Steel Water Bottle', sku: 'SPRT-002', price: 29.99, cost: 7, stock: 567, category: 'Sports', description: 'Double-wall vacuum insulated bottle, keeps cold 24hrs/hot 12hrs, 750ml.' },
  { name: 'Resistance Bands Set', sku: 'SPRT-003', price: 24.99, cost: 5, stock: 412, category: 'Sports', description: 'Set of 5 fabric resistance bands with different tension levels and carry bag.' },
  { name: 'Running Shoes Pro', sku: 'SPRT-004', price: 139.99, cost: 45, stock: 88, category: 'Sports', description: 'Lightweight running shoes with responsive cushioning and breathable mesh.' },
  { name: 'The Complete TypeScript Guide', sku: 'BOOK-001', price: 44.99, cost: 8, stock: 156, category: 'Books', description: 'Comprehensive guide covering TypeScript from basics to advanced patterns.' },
  { name: 'System Design Interview', sku: 'BOOK-002', price: 39.99, cost: 6, stock: 203, category: 'Books', description: 'Step-by-step guide to ace system design interviews at top tech companies.' },
  { name: 'Clean Code Handbook', sku: 'BOOK-003', price: 34.99, cost: 5, stock: 178, category: 'Books', description: 'Practical guide to writing maintainable, readable, and elegant code.' },
  { name: 'Ergonomic Office Chair', sku: 'HOME-004', price: 349.99, cost: 120, stock: 34, category: 'Home & Garden', description: 'Fully adjustable ergonomic chair with lumbar support, headrest, and armrests.' },
];

const customerNames = [
  'Alice Johnson', 'Bob Smith', 'Carol Williams', 'David Brown', 'Emma Davis',
  'Frank Miller', 'Grace Wilson', 'Henry Moore', 'Iris Taylor', 'Jack Anderson',
  'Karen Thomas', 'Leo Jackson', 'Mia White', 'Nathan Harris', 'Olivia Martin',
  'Peter Garcia', 'Quinn Martinez', 'Rachel Robinson', 'Sam Clark', 'Tina Rodriguez',
  'Uma Lewis', 'Victor Lee', 'Wendy Walker', 'Xavier Hall', 'Yuki Allen',
  'Zara Young', 'Aaron King', 'Bella Wright', 'Chris Lopez', 'Diana Hill',
];

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const paymentStatuses = ['paid', 'pending', 'refunded'];
const paymentMethods = ['credit_card', 'paypal', 'stripe', 'bank_transfer'];

function randomBetween(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomDate(start, end) { return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())); }

async function main() {
  console.log('Seeding database...');

  await prisma.review.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.orderTimelineEntry.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.inventoryLog.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.store.deleteMany();
  await prisma.auditLog.deleteMany();

  const store = await prisma.store.create({ data: { id: STORE_ID, name: 'Ziyad Store', slug: 'ziyad-store', currency: 'USD', email: 'store@ziyad.dev' } });
  await prisma.setting.create({ data: { storeId: STORE_ID, taxRate: 0.08, shippingRate: 5.99 } });

  const catMap = {};
  for (const cat of categories) {
    const created = await prisma.category.create({ data: { ...cat, storeId: STORE_ID } });
    catMap[cat.name] = created.id;
  }
  console.log(`Created ${categories.length} categories`);

  const products = [];
  for (const p of productData) {
    const product = await prisma.product.create({
      data: {
        name: p.name, slug: p.sku.toLowerCase(), sku: p.sku, price: p.price, cost: p.cost,
        stock: p.stock, description: p.description, status: 'active', featured: Math.random() > 0.7,
        storeId: STORE_ID, categoryId: catMap[p.category],
        images: { create: [{ url: `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop`, alt: p.name }] },
      },
    });
    products.push(product);
  }
  console.log(`Created ${products.length} products`);

  const customers = [];
  for (const name of customerNames) {
    const email = name.toLowerCase().replace(' ', '.') + '@example.com';
    const customer = await prisma.customer.create({ data: { name, email, phone: `+1-555-${randomBetween(100, 999)}-${randomBetween(1000, 9999)}` } });
    customers.push(customer);
  }
  console.log(`Created ${customers.length} customers`);

  const now = new Date();
  const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

  const orders = [];
  for (let i = 0; i < 120; i++) {
    const customer = randomItem(customers);
    const orderDate = randomDate(sixMonthsAgo, now);
    const numItems = randomBetween(1, 4);
    const orderItems = [];
    let subtotal = 0;

    for (let j = 0; j < numItems; j++) {
      const product = randomItem(products);
      const qty = randomBetween(1, 3);
      const price = product.salePrice || product.price;
      const itemTotal = Math.round(price * qty * 100) / 100;
      subtotal += itemTotal;
      orderItems.push({ name: product.name, sku: product.sku, price, quantity: qty, total: itemTotal, productId: product.id });
    }

    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const shipping = subtotal > 100 ? 0 : 5.99;
    const total = Math.round((subtotal + tax + shipping) * 100) / 100;
    const status = randomItem(statuses);
    const pStatus = status === 'cancelled' ? 'refunded' : randomItem(paymentStatuses);

    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${(1000 + i).toString()}`, status, paymentStatus: pStatus,
        paymentMethod: randomItem(paymentMethods), subtotal, tax, shipping, total,
        customerId: customer.id, storeId: STORE_ID,
        shippingAddress: `${randomBetween(100, 9999)} Main St, City, US`,
        createdAt: orderDate, updatedAt: orderDate,
        items: { create: orderItems },
        statusHistory: { create: [{ status: 'pending', note: 'Order created', createdAt: orderDate }] },
      },
    });
    orders.push(order);
  }
  console.log(`Created ${orders.length} orders`);

  for (const product of products) {
    const logCount = randomBetween(1, 5);
    for (let i = 0; i < logCount; i++) {
      await prisma.inventoryLog.create({
        data: {
          type: randomItem(['sale', 'restock', 'adjustment']),
          quantity: randomBetween(1, 20),
          note: `Inventory ${randomItem(['sale', 'restock', 'correction'])}`,
          productId: product.id,
          createdAt: randomDate(sixMonthsAgo, now),
        },
      });
    }
  }

  const reviewStatuses = ['approved', 'pending', 'approved', 'approved'];
  for (const product of products.slice(0, 12)) {
    const reviewCount = randomBetween(1, 3);
    for (let i = 0; i < reviewCount; i++) {
      await prisma.review.create({
        data: {
          rating: randomBetween(3, 5), title: randomItem(['Great product!', 'Excellent quality', 'Fast shipping', 'Very satisfied', 'Good value']),
          content: randomItem(['Really happy with this purchase.', 'Exceeded my expectations.', 'Would buy again.', 'Great quality for the price.', 'Arrived quickly and works perfectly.']),
          status: randomItem(reviewStatuses),
          customerId: randomItem(customers).id,
          productId: product.id,
        },
      });
    }
  }
  console.log('Created reviews');

  await prisma.auditLog.createMany({
    data: [
      { action: 'created', entity: 'product', details: 'Added new product', createdAt: randomDate(sixMonthsAgo, now) },
      { action: 'updated', entity: 'order', details: 'Updated order status', createdAt: randomDate(sixMonthsAgo, now) },
      { action: 'created', entity: 'customer', details: 'New customer registered', createdAt: randomDate(sixMonthsAgo, now) },
    ],
  });

  console.log('Seed completed successfully!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
