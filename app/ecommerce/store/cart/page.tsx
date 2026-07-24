'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string;
    stock: number;
    vendor: { businessName: string };
  };
}

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('marketplace_user');
    if (!stored) {
      router.push('/ecommerce/store/auth');
      return;
    }
    const user = JSON.parse(stored);
    setUserId(user.id);
    fetchCart(user.id);
  }, [router]);

  async function fetchCart(uid: string) {
    try {
      const res = await fetch(`/ecommerce/api/marketplace/cart?userId=${uid}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {} finally {
      setLoading(false);
    }
  }

  async function updateQuantity(cartItemId: string, newQty: number) {
    if (newQty < 1) return;
    const item = items.find((i) => i.id === cartItemId);
    if (item && newQty > item.product.stock) return;

    setItems(items.map((i) => i.id === cartItemId ? { ...i, quantity: newQty } : i));
  }

  async function removeItem(cartItemId: string) {
    try {
      await fetch(`/ecommerce/api/marketplace/cart?cartItemId=${cartItemId}`, { method: 'DELETE' });
      setItems(items.filter((i) => i.id !== cartItemId));
    } catch {}
  }

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.1 * 100) / 100;
  const shipping = items.length > 0 ? 5.99 : 0;
  const total = subtotal + tax + shipping;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <ShoppingBag className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Your cart is empty</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Browse products and add them to your cart.</p>
          <Link href="/ecommerce/store/products" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
            <ShoppingBag className="w-4 h-4" /> Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-lg flex items-center justify-center shrink-0">
                  <Package className="w-8 h-8 text-indigo-300 dark:text-indigo-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/ecommerce/store/products/${item.product.slug}`} className="text-sm font-medium text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-1">
                    {item.product.name}
                  </Link>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5">{item.product.vendor.businessName}</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">${item.product.price.toFixed(2)}</p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => removeItem(item.id)} className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-indigo-600">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-slate-900 dark:text-white">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-indigo-600">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sticky top-24">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="text-slate-900 dark:text-white font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Tax (10%)</span>
                  <span className="text-slate-900 dark:text-white font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Shipping</span>
                  <span className="text-slate-900 dark:text-white font-medium">${shipping.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between">
                  <span className="text-base font-semibold text-slate-900 dark:text-white">Total</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white">${total.toFixed(2)}</span>
                </div>
              </div>
              <Link
                href="/ecommerce/store/checkout"
                className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
