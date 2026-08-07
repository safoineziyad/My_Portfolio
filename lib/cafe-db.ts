import { readFile } from 'fs/promises';
import { join } from 'path';
import prisma from '@/ecommerce/lib/db';

export interface CafeDb {
  menu: MenuEntry[];
  reservations: Reservation[];
  orders: Order[];
  contactMessages: ContactMessage[];
}

export interface MenuEntry {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isPopular?: boolean;
}

export interface Reservation {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequests: string;
  status: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  specialInstructions: string;
  items: { menuItemId: number; name: string; quantity: number; priceAtTime: number }[];
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

const DB_FILE = join(process.cwd(), 'data', 'cafe-database.json');

async function readSeedFromFile(): Promise<CafeDb | null> {
  try {
    const data = await readFile(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed.menu) && parsed.menu.length > 0) {
      return parsed as CafeDb;
    }
    return null;
  } catch {
    return null;
  }
}

export async function readCafeDb(): Promise<CafeDb> {
  const [menu, reservations, orders, contactMessages] = await Promise.all([
    prisma.cafeMenuItem.findMany(),
    prisma.cafeReservation.findMany(),
    prisma.cafeOrder.findMany({ include: { items: true }, orderBy: { createdAt: 'desc' } }),
    prisma.cafeContactMessage.findMany(),
  ]);

  if (menu.length === 0) {
    const seed = await readSeedFromFile();
    if (seed) {
      await writeCafeDb(seed);
      return seed;
    }
    return { menu: [], reservations: [], orders: [], contactMessages: [] };
  }

  return {
    menu: menu.map((m) => ({
      id: m.id,
      name: m.name,
      description: m.description,
      price: m.price,
      category: m.category,
      image: m.image,
      isPopular: m.isPopular,
    })),
    reservations: reservations.map((r) => ({
      id: Number(r.id),
      name: r.name,
      email: r.email,
      phone: r.phone,
      date: r.date,
      time: r.time,
      guests: r.guests,
      specialRequests: r.specialRequests,
      status: r.status,
      createdAt: r.createdAt,
    })),
    orders: orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: o.customerName,
      customerEmail: o.customerEmail,
      customerPhone: o.customerPhone,
      address: o.address,
      specialInstructions: o.specialInstructions,
      status: o.status,
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      total: o.total,
      createdAt: o.createdAt,
      items: o.items.map((i) => ({
        menuItemId: i.menuItemId,
        name: i.name,
        quantity: i.quantity,
        priceAtTime: i.priceAtTime,
      })),
    })),
    contactMessages: contactMessages.map((m) => ({
      id: Number(m.id),
      name: m.name,
      email: m.email,
      message: m.message,
      createdAt: m.createdAt,
    })),
  };
}

export async function writeCafeDb(data: CafeDb): Promise<void> {
  const menuIds = data.menu.map((m) => m.id);
  const reservationIds = data.reservations.map((r) => String(r.id));
  const orderIds = data.orders.map((o) => o.id);
  const messageIds = data.contactMessages.map((m) => String(m.id));

  await prisma.$transaction([
    prisma.cafeMenuItem.deleteMany({ where: menuIds.length ? { id: { notIn: menuIds } } : {} }),
    prisma.cafeReservation.deleteMany({ where: reservationIds.length ? { id: { notIn: reservationIds } } : {} }),
    prisma.cafeContactMessage.deleteMany({ where: messageIds.length ? { id: { notIn: messageIds } } : {} }),
    prisma.cafeOrderItem.deleteMany({ where: orderIds.length ? { order: { id: { notIn: orderIds } } } : {} }),
    prisma.cafeOrder.deleteMany({ where: orderIds.length ? { id: { notIn: orderIds } } : {} }),
  ]);

  for (const item of data.menu) {
    await prisma.cafeMenuItem.upsert({
      where: { id: item.id },
      create: {
        id: item.id,
        name: item.name,
        description: item.description || '',
        price: item.price,
        category: item.category,
        image: item.image || '',
        isPopular: !!item.isPopular,
      },
      update: {
        name: item.name,
        description: item.description || '',
        price: item.price,
        category: item.category,
        image: item.image || '',
        isPopular: !!item.isPopular,
      },
    });
  }

  for (const r of data.reservations) {
    await prisma.cafeReservation.upsert({
      where: { id: String(r.id) },
      create: {
        id: String(r.id),
        name: r.name,
        email: r.email || '',
        phone: r.phone,
        date: r.date,
        time: r.time,
        guests: r.guests,
        specialRequests: r.specialRequests || '',
        status: r.status,
        createdAt: r.createdAt,
      },
      update: {
        name: r.name,
        email: r.email || '',
        phone: r.phone,
        date: r.date,
        time: r.time,
        guests: r.guests,
        specialRequests: r.specialRequests || '',
        status: r.status,
        createdAt: r.createdAt,
      },
    });
  }

  for (const m of data.contactMessages) {
    await prisma.cafeContactMessage.upsert({
      where: { id: String(m.id) },
      create: {
        id: String(m.id),
        name: m.name,
        email: m.email,
        message: m.message,
        createdAt: m.createdAt,
      },
      update: {
        name: m.name,
        email: m.email,
        message: m.message,
        createdAt: m.createdAt,
      },
    });
  }

  for (const o of data.orders) {
    await prisma.cafeOrder.upsert({
      where: { id: o.id },
      create: {
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        customerEmail: o.customerEmail,
        customerPhone: o.customerPhone,
        address: o.address,
        specialInstructions: o.specialInstructions || '',
        status: o.status,
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        total: o.total,
        createdAt: o.createdAt,
        items: {
          create: o.items.map((i) => ({
            menuItemId: i.menuItemId,
            name: i.name,
            quantity: i.quantity,
            priceAtTime: i.priceAtTime,
          })),
        },
      },
      update: {
        customerName: o.customerName,
        customerEmail: o.customerEmail,
        customerPhone: o.customerPhone,
        address: o.address,
        specialInstructions: o.specialInstructions || '',
        status: o.status,
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        total: o.total,
        items: {
          deleteMany: {},
          create: o.items.map((i) => ({
            menuItemId: i.menuItemId,
            name: i.name,
            quantity: i.quantity,
            priceAtTime: i.priceAtTime,
          })),
        },
      },
    });
  }
}
