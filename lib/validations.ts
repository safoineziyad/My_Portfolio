import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
});

export const orderSchema = z.object({
  customerId: z.string().min(1),
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().int().positive(),
  })).min(1, 'At least one item required'),
  shippingAddress: z.string().optional(),
  billingAddress: z.string().optional(),
  notes: z.string().max(500).optional(),
  paymentMethod: z.enum(['credit_card', 'paypal', 'stripe', 'bank_transfer']).optional(),
});

export const productSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  sku: z.string().max(50).optional(),
  price: z.number().positive(),
  cost: z.number().positive().optional(),
  salePrice: z.number().positive().optional(),
  stock: z.number().int().min(0).default(0),
  categoryId: z.string().optional(),
  status: z.enum(['active', 'draft', 'archived']).default('active'),
  featured: z.boolean().default(false),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).optional(),
  content: z.string().max(2000).optional(),
  productId: z.string().min(1),
});

export const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(5000),
});

export const cafeOrderSchema = z.object({
  items: z.array(z.object({
    id: z.number(),
    name: z.string(),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
  })).min(1),
  customerName: z.string().min(1).max(100),
  customerPhone: z.string().min(1).max(20),
  tableNumber: z.number().int().positive().optional(),
  notes: z.string().max(500).optional(),
});

export const cafeReservationSchema = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().min(1).max(20),
  email: z.string().email().optional(),
  date: z.string().min(1),
  time: z.string().min(1),
  guests: z.number().int().min(1).max(20),
  notes: z.string().max(500).optional(),
});
