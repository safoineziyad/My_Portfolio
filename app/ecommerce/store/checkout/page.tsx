'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, ArrowLeft, CreditCard, Loader2, CheckCircle2 } from 'lucide-react';

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    vendor: { businessName: string };
  };
}

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [shipping, setShipping] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumbers, setOrderNumbers] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('marketplace_user');
    if (!stored) { router.push('/ecommerce/store/auth'); return; }
    const user = JSON.parse(stored);
    setUserId(user.id);
    setShipping((s) => ({ ...s, fullName: user.name || '' }));
    fetchCart(user.id);
  }, [router]);

  async function fetchCart(uid: string) {
    try {
      const res = await fetch(`/ecommerce/api/marketplace/cart?userId=${uid}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {} finally { setLoading(false); }
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setPlacing(true);
    try {
      const addressStr = `${shipping.fullName}, ${shipping.address}, ${shipping.city}, ${shipping.state} ${shipping.zipCode}, ${shipping.country}`;
      const res = await fetch('/ecommerce/api/marketplace/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, shippingAddress: addressStr, paymentMethod }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrderNumbers(data.map((o: any) => o.orderNumber));
        setOrderSuccess(true);
      }
    } catch {} finally { setPlacing(false); }
  }

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.1 * 100) / 100;
  const shippingCost = items.length > 0 ? 5.99 : 0;
  const total = subtotal + tax + shippingCost;

  if (loading) {
    return <div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 text-indigo-600 animate-spin" /></div>;
  }

  if (orderSuccess) {
    return (
      <div className="max-w-lg mx-auto px-4 py-32 text-center">
        <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-8">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Order Placed!</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Your order has been placed successfully.</p>
          {orderNumbers.length > 0 && (
            <div className="mb-6">
              <p className="text-xs text-slate-400 mb-1">Order Number(s):</p>
              {orderNumbers.map((n) => (
                <p key={n} className="text-sm font-mono font-medium text-slate-900 dark:text-white">{n}</p>
              ))}
            </div>
          )}
          <Link href="/ecommerce/store/products" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-32 text-center">
        <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-8">
          <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Cart is empty</h1>
          <Link href="/ecommerce/store/products" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Checkout</h1>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Shipping Address</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Full Name</label>
                  <input type="text" required value={shipping.fullName} onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Address</label>
                  <input type="text" required value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">City</label>
                  <input type="text" required value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">State</label>
                  <input type="text" value={shipping.state} onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">ZIP Code</label>
                  <input type="text" required value={shipping.zipCode} onChange={(e) => setShipping({ ...shipping, zipCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Country</label>
                  <input type="text" required value={shipping.country} onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Phone</label>
                  <input type="tel" value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Payment Method</h3>
              <div className="space-y-3">
                {[
                  { value: 'card', label: 'Credit / Debit Card', icon: CreditCard },
                  { value: 'paypal', label: 'PayPal', icon: CreditCard },
                  { value: 'cod', label: 'Cash on Delivery', icon: CreditCard },
                ].map((method) => (
                  <label key={method.value} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${paymentMethod === method.value ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}>
                    <input type="radio" name="payment" value={method.value} checked={paymentMethod === method.value} onChange={() => setPaymentMethod(method.value)} className="text-indigo-600 focus:ring-indigo-500" />
                    <method.icon className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sticky top-24">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400 truncate mr-2">{item.product.name} x{item.quantity}</span>
                    <span className="text-slate-900 dark:text-white font-medium shrink-0">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span><span className="text-slate-900 dark:text-white font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Tax (10%)</span><span className="text-slate-900 dark:text-white font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Shipping</span><span className="text-slate-900 dark:text-white font-medium">${shippingCost.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between">
                  <span className="text-base font-semibold text-slate-900 dark:text-white">Total</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white">${total.toFixed(2)}</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={placing}
                className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-60"
              >
                {placing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
