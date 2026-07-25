export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isPopular?: boolean;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
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
  items: OrderItem[];
  status: string;
  paymentMethod: string;
  paymentLabel?: string;
  paymentStatus: string;
  total: number;
  _csrf?: string;
  createdAt: string;
}

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  found?: boolean;
  reservation?: Reservation;
  capacityMsg?: string;
  order?: Order;
  apiKey?: string;
  totalOrders?: number;
  totalReservations?: number;
  totalMenuItems?: number;
}

export interface CardType {
  type: string;
  icon: string;
  color: string;
}

export type PaymentMethod = 'card' | 'wallet';
export type WalletType = 'paypal' | 'apple' | 'google' | 'cashapp';
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export const MENU_CATEGORIES = [
  'All',
  'Hot Drinks',
  'Cold Drinks',
  'Pastries',
  'Desserts',
  'Savory Food',
  'Waffles & Crepes',
] as const;

export type MenuCategory = (typeof MENU_CATEGORIES)[number];
