'use client';

import { useEffect, useState } from 'react';
import { TopBar } from '@/ecommerce/components/Sidebar';
import { formatCurrency, formatDate, getStatusColor } from '@/ecommerce/lib/utils';
import { Package, ShoppingCart, DollarSign, Star, TrendingUp, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface VendorStats {
  totalProducts: number;
  pendingOrders: number;
  revenue: number;
  rating: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  items: { id: string; name: string; quantity: number }[];
  createdAt: string;
}

export default function VendorDashboardPage() {
  const [stats, setStats] = useState<VendorStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const vendorId = localStorage.getItem('vendorId');
    if (!vendorId) {
      setLoading(false);
      return;
    }

    Promise.all([
      fetch(`/ecommerce/api/vendor/stats?vendorId=${vendorId}`).then(r => r.json()),
      fetch(`/ecommerce/api/vendor/orders?vendorId=${vendorId}&limit=5`).then(r => r.json()),
    ])
      .then(([statsData, ordersData]) => {
        setStats(statsData);
        setRecentOrders(Array.isArray(ordersData) ? ordersData.slice(0, 5) : (ordersData.data || []).slice(0, 5));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Products', value: stats?.totalProducts ?? 0, icon: Package, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
    { label: 'Pending Orders', value: stats?.pendingOrders ?? 0, icon: ShoppingCart, color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
    { label: 'Revenue', value: formatCurrency(stats?.revenue ?? 0), icon: DollarSign, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
    { label: 'Rating', value: (stats?.rating ?? 0).toFixed(1), icon: Star, color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <TopBar title="Vendor Dashboard" />
      <div className="p-4 lg:p-6 space-y-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-5 animate-pulse">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24 mb-3" />
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-16" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card) => (
              <div key={card.label} className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
                  <div className={`p-2 rounded-lg ${card.color}`}>
                    <card.icon size={16} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{card.value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Orders</h3>
            <Link
              href="/ecommerce/vendor/orders"
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1"
            >
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-slate-100 dark:bg-slate-900 rounded animate-pulse" />
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="py-12 text-center">
              <ShoppingCart size={40} className="mx-auto mb-3 text-slate-300 dark:text-slate-700" />
              <p className="text-sm text-slate-500 dark:text-slate-400">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Order</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Items</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                    <th className="text-center py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">{order.orderNumber}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                      <td className="py-3 px-4 text-right font-medium text-slate-900 dark:text-white">{formatCurrency(order.total)}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-500 dark:text-slate-400">{formatDate(order.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
