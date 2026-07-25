'use client';

import { create } from 'zustand';
import type { CartItem } from './types';
import { calculateTax, calculateGrandTotal } from './payment-utils';

const CART_KEY = 'cafeNomadCart';

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

interface CartStore {
  items: CartItem[];
  initialized: boolean;
  toast: string;
  init: () => void;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, qty: number) => void;
  changeQuantity: (id: number, delta: number) => void;
  clear: () => void;
  getTotal: () => number;
  getTax: () => number;
  getGrandTotal: () => number;
  getCount: () => number;
  hideToast: () => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  initialized: false,
  toast: '',

  init: () => {
    const items = loadCart();
    set({ items, initialized: true });
  },

  addItem: (menuItem) => {
    const items = loadCart();
    const existing = items.find((i) => i.id === menuItem.id);
    let newItems: CartItem[];
    if (existing) {
      newItems = items.map((i) =>
        i.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      newItems = [...items, { ...menuItem, quantity: 1 }];
    }
    saveCart(newItems);
    set({ items: newItems, toast: `${menuItem.name} added to cart` });
  },

  removeItem: (id) => {
    const items = loadCart().filter((i) => i.id !== id);
    saveCart(items);
    set({ items });
  },

  updateQuantity: (id, qty) => {
    const items = loadCart().map((i) =>
      i.id === id ? { ...i, quantity: Math.max(1, qty) } : i
    );
    saveCart(items);
    set({ items });
  },

  changeQuantity: (id, delta) => {
    const items = loadCart();
    const item = items.find((i) => i.id === id);
    if (item) {
      const newQty = Math.max(1, item.quantity + delta);
      const newItems = items.map((i) =>
        i.id === id ? { ...i, quantity: newQty } : i
      );
      saveCart(newItems);
      set({ items: newItems });
    }
  },

  clear: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CART_KEY);
    }
    set({ items: [] });
  },

  getTotal: () => {
    return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  },

  getTax: () => {
    return calculateTax(get().getTotal());
  },

  getGrandTotal: () => {
    return calculateGrandTotal(get().getTotal());
  },

  getCount: () => {
    return get().items.reduce((sum, i) => sum + i.quantity, 0);
  },

  hideToast: () => set({ toast: '' }),
}));
