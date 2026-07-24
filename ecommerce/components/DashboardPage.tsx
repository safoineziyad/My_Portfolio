'use client';

import { useEffect, useState } from 'react';
import { formatCurrency, getStatusColor, formatDate } from '@/ecommerce/lib/utils';
import { DollarSign, ShoppingCart, Users, TrendingUp, TrendingDown, Package, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import Link from 'next/link';

interface DashboardData {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    revenueChange: number;
    ordersChange: number;
    customersChange: number;
    averageOrderValue: number;
  };
  recentOrders: any[];
  revenueByDay: any[];
  ordersByStatus: any[];
  topProducts: any[];
  lowStockProducts: any[];
}

const CHART_COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

function StatCard({ title, value, change, icon: Icon, iconBg }: {
  title: string; value: string; change: number; icon: any; iconBg: string;
}) {
  const isPositive = change >= 0;
  return (
    <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
        </div>
        <div className={`p-2.5 rounded-lg ${iconBg}`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-3">
        {isPositive ? <TrendingUp size={14} className="text-emerald-500" /> : <TrendingDown size={14} className="text-red-500" />}
        <span className={`text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
          {isPositive ? '+' : ''}{change}%
        </span>
        <span className="text-xs text-slate-400">vs last period</span>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-medium text-slate-900 dark:text-white mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {p.name === 'Revenue' ? formatCurrency(p.value) : p.value}
        </p>
      ))}
    </div>
  );
}

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/ecommerce/api/analytics')
      .then(r => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-5 animate-pulse">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24 mb-3" />
              <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-32 mb-3" />
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-20" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-5 h-80 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return <div className="text-center py-20 text-slate-500">Failed to load dashboard data</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={formatCurrency(data.stats.totalRevenue)} change={data.stats.revenueChange} icon={DollarSign} iconBg="bg-indigo-600" />
        <StatCard title="Total Orders" value={data.stats.totalOrders.toLocaleString()} change={data.stats.ordersChange} icon={ShoppingCart} iconBg="bg-cyan-600" />
        <StatCard title="Customers" value={data.stats.totalCustomers.toLocaleString()} change={data.stats.customersChange} icon={Users} iconBg="bg-emerald-600" />
        <StatCard title="Avg. Order Value" value={formatCurrency(data.stats.averageOrderValue)} change={5.2} icon={TrendingUp} iconBg="bg-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Revenue Overview</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">Last 30 days</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueByDay}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Orders by Status</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.ordersByStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} innerRadius={50} paddingAngle={3}>
                  {data.ordersByStatus.map((_: any, i: number) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Top Products</h3>
            <Link href="/ecommerce/dashboard/products" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topProducts} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `$${v}`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} width={120} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" name="Revenue" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Low Stock Alerts</h3>
            <Link href="/ecommerce/dashboard/products" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
              Manage <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {(!data.lowStockProducts || data.lowStockProducts.length === 0) ? (
              <div className="text-center py-8 text-slate-400">
                <Package size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">All products are well stocked</p>
              </div>
            ) : (
              data.lowStockProducts.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-1.5 rounded-lg ${p.stock === 0 ? 'bg-red-100 dark:bg-red-900/30' : 'bg-amber-100 dark:bg-amber-900/30'}`}>
                      <AlertTriangle size={14} className={p.stock === 0 ? 'text-red-600' : 'text-amber-600'} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{p.name}</p>
                      <p className="text-xs text-slate-500">Threshold: {p.lowStockThreshold}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${p.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                    {p.stock} left
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900 dark:text-white">Recent Orders</h3>
          <Link href="/ecommerce/dashboard/orders" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
            View all <ArrowUpRight size={12} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="text-left py-3 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Order</th>
                <th className="text-left py-3 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="text-left py-3 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Payment</th>
                <th className="text-right py-3 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                <th className="text-right py-3 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.map((order: any) => (
                <tr key={order.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 px-3 font-medium text-slate-900 dark:text-white">{order.orderNumber}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{order.customer.name}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-slate-900 dark:text-white">{formatCurrency(order.total)}</td>
                  <td className="py-3 px-3 text-right text-slate-500 dark:text-slate-400">{formatDate(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
