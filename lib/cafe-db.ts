import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const DB_FILE = join(process.cwd(), 'data', 'cafe-database.json');

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

export async function readCafeDb(): Promise<CafeDb> {
  try {
    const data = await readFile(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { menu: [], reservations: [], orders: [], contactMessages: [] };
  }
}

export async function writeCafeDb(data: CafeDb): Promise<void> {
  await writeFile(DB_FILE, JSON.stringify(data, null, 2));
}
