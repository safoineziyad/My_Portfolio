export interface ProductWithRelations {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sku: string | null;
  price: number;
  cost: number | null;
  salePrice: number | null;
  stock: number;
  lowStockThreshold: number;
  status: string;
  featured: boolean;
  weight: number | null;
  createdAt: Date;
  updatedAt: Date;
  category?: { id: string; name: string } | null;
  images?: { id: string; url: string; alt: string | null }[];
  variants?: { id: string; name: string; sku: string | null; price: number; stock: number }[];
  _count?: { orderItems: number; reviews: number };
}

export interface OrderWithRelations {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  notes: string | null;
  shippingAddress: string | null;
  billingAddress: string | null;
  createdAt: Date;
  updatedAt: Date;
  customer: { id: string; name: string; email: string };
  items: { id: string; name: string; price: number; quantity: number; total: number }[];
  statusHistory?: { id: string; status: string; note: string | null; createdAt: Date }[];
}

export interface CustomerWithRelations {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: Date;
  _count?: { orders: number };
  _sum?: { orders: { total: number } | null };
  orders?: { id: string; orderNumber: string; total: number; status: string; createdAt: Date }[];
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
  averageOrderValue: number;
  recentOrders: OrderWithRelations[];
  topProducts: { name: string; revenue: number; quantity: number }[];
  revenueByDay: { date: string; revenue: number; orders: number }[];
  ordersByStatus: { status: string; count: number }[];
  lowStockProducts: { id: string; name: string; stock: number; lowStockThreshold: number }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
