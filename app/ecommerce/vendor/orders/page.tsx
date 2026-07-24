'use client';

import { useEffect, useState } from 'react';
import { TopBar } from '@/ecommerce/components/Sidebar';
import { formatCurrency, formatDate, getStatusColor } from '@/ecommerce/lib/utils';
import { Search, Eye, Package, X, Clock, CheckCircle, Truck, XCircle, RotateCw } from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

interface OrderTimeline {
  id: string;
  status: string;
  note: string | null;
  createdAt: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  tax: number;
  shipping: number;
  commission: number;
  total: number;
  createdAt: string;
  user: { id: string; name: string; email: string };
  items: OrderItem[];
  timeline: OrderTimeline[];
}

const VENDOR_STATUS_OPTIONS = ['packing', 'shipped', 'delivered', 'completed'];

function getStatusIcon(status: string) {
  switch (status) {
    case 'pending': return <Clock size={14} className="text-amber-500" />;
    case 'paid': return <CheckCircle size={14} className="text-emerald-500" />;
    case 'packing': return <Package size={14} className="text-blue-500" />;
    case 'shipped': return <Truck size={14} className="text-indigo-500" />;
    case 'delivered': return <CheckCircle size={14} className="text-emerald-500" />;
    case 'completed': return <CheckCircle size={14} className="text-emerald-500" />;
    case 'cancelled': return <XCircle size={14} className="text-red-500" />;
    case 'returned': return <RotateCw size={14} className="text-orange-500" />;
    default: return <Clock size={14} className="text-slate-500" />;
  }
}

function OrderDetailModal({ order, onClose, onStatusUpdate }: { order: Order; onClose: () => void; onStatusUpdate: (orderId: string, status: string) => void }) {
  const [newStatus, setNewStatus] = useState(order.status);
  const [saving, setSaving] = useState(false);

  const availableStatuses = VENDOR_STATUS_OPTIONS.filter(s => {
    const orderStatuses = ['pending', 'paid', 'packing', 'shipped', 'delivered', 'completed'];
    const currentIndex = orderStatuses.indexOf(order.status);
    const newIndex = orderStatuses.indexOf(s);
    return newIndex >= currentIndex;
  });

  const handleSave = async () => {
    setSaving(true);
    await onStatusUpdate(order.id, newStatus);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
          <X size={18} />
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{order.orderNumber}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{formatDate(order.createdAt)}</p>
          </div>
          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Customer</p>
            <p className="text-sm font-medium text-slate-900 dark:text-white">{order.user.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{order.user.email}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Payment</p>
            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.paymentStatus)}`}>
              {order.paymentStatus}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Items</h4>
          <div className="space-y-2">
            {order.items.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{item.name}</p>
                  <p className="text-xs text-slate-500">Qty: {item.quantity} x {formatCurrency(item.price)}</p>
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{formatCurrency(item.total)}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 space-y-1 text-right">
            <p className="text-xs text-slate-500">Subtotal: {formatCurrency(order.subtotal)}</p>
            {order.tax > 0 && <p className="text-xs text-slate-500">Tax: {formatCurrency(order.tax)}</p>}
            {order.shipping > 0 && <p className="text-xs text-slate-500">Shipping: {formatCurrency(order.shipping)}</p>}
            {order.commission > 0 && <p className="text-xs text-slate-500">Commission: {formatCurrency(order.commission)}</p>}
            <p className="text-sm font-bold text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-800">Total: {formatCurrency(order.total)}</p>
          </div>
        </div>

        {order.timeline && order.timeline.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Timeline</h4>
            <div className="space-y-3">
              {order.timeline.map((t, i) => (
                <div key={t.id} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="p-1 rounded-full bg-slate-200 dark:bg-slate-800">
                      {getStatusIcon(t.status)}
                    </div>
                    {i < order.timeline.length - 1 && <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mt-1" />}
                  </div>
                  <div className="pb-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white capitalize">{t.status}</p>
                    {t.note && <p className="text-xs text-slate-500 dark:text-slate-400">{t.note}</p>}
                    <p className="text-xs text-slate-400">{formatDate(t.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <select
            value={newStatus}
            onChange={e => setNewStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {availableStatuses.map(s => (
              <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <button
            onClick={handleSave}
            disabled={saving || newStatus === order.status}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Update Status'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [vendorId, setVendorId] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('vendorId') || '';
    setVendorId(id);
  }, []);

  const fetchOrders = async () => {
    if (!vendorId) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ vendorId, status: statusFilter });
      if (search) params.set('search', search);
      const res = await fetch(`/ecommerce/api/vendor/orders?${params}`);
      const data = await res.json();
      setOrders(data.data || data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vendorId) fetchOrders();
  }, [vendorId, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      await fetch('/ecommerce/api/vendor/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOrders = search
    ? orders.filter(o =>
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.user?.name?.toLowerCase().includes(search.toLowerCase())
      )
    : orders;

  return (
    <div className="flex-1 overflow-y-auto">
      <TopBar title="Orders" />
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search orders..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="packing">Packing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </form>
          <p className="text-sm text-slate-500 dark:text-slate-400">{filteredOrders.length} orders</p>
        </div>

        {loading ? (
          <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border-b border-slate-100 dark:border-slate-800/50 animate-pulse">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-32" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24" />
              </div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <Package size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-700" />
            <p className="text-slate-500 dark:text-slate-400">No orders found</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Order #</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Buyer</th>
                    <th className="text-center py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Items</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                    <th className="text-center py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="text-center py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">{order.orderNumber}</td>
                      <td className="py-3 px-4">
                        <p className="text-slate-900 dark:text-white">{order.user?.name || 'Unknown'}</p>
                        <p className="text-xs text-slate-500">{order.user?.email || ''}</p>
                      </td>
                      <td className="py-3 px-4 text-center text-slate-600 dark:text-slate-400">{order.items.length}</td>
                      <td className="py-3 px-4 text-right font-medium text-slate-900 dark:text-white">{formatCurrency(order.total)}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-500 dark:text-slate-400">{formatDate(order.createdAt)}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => { setSelectedOrder(order); setShowDetailModal(true); }}
                          className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showDetailModal && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => { setShowDetailModal(false); setSelectedOrder(null); }}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}
