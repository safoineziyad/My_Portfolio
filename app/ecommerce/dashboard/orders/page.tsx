'use client';
import { useEffect, useState } from 'react';
import { TopBar } from '@/ecommerce/components/Sidebar';
import { formatCurrency, formatDate } from '@/ecommerce/lib/utils';
import { Search, Eye, ChevronLeft, ChevronRight, Package, X, Truck, CheckCircle, Clock, XCircle, RotateCw } from 'lucide-react';

interface Order {
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
  createdAt: string;
  updatedAt: string;
  customer: { id: string; name: string; email: string };
  items: { id: string; name: string; price: number; quantity: number; total: number }[];
  statusHistory?: { id: string; status: string; note: string | null; createdAt: string }[];
}

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

function getStatusBadge(status: string) {
  const map: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    shipped: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    delivered: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };
  return map[status] || 'bg-slate-100 text-slate-600';
}

function getPaymentBadge(status: string) {
  const map: Record<string, string> = {
    paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    refunded: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    partially_refunded: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  };
  return map[status] || 'bg-slate-100 text-slate-600';
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'pending': return <Clock size={14} className="text-amber-500" />;
    case 'processing': return <RotateCw size={14} className="text-blue-500" />;
    case 'shipped': return <Truck size={14} className="text-indigo-500" />;
    case 'delivered': return <CheckCircle size={14} className="text-emerald-500" />;
    case 'cancelled': return <XCircle size={14} className="text-red-500" />;
    default: return <Clock size={14} className="text-slate-500" />;
  }
}

function OrderDetailModal({ order, onClose, onStatusUpdate }: { order: Order; onClose: () => void; onStatusUpdate: (id: string, status: string) => void }) {
  const [newStatus, setNewStatus] = useState(order.status);
  const [saving, setSaving] = useState(false);

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
          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
            {order.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Customer</p>
            <p className="text-sm font-medium text-slate-900 dark:text-white">{order.customer.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{order.customer.email}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Payment</p>
            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getPaymentBadge(order.paymentStatus)}`}>
              {order.paymentStatus}
            </span>
            {order.paymentMethod && <p className="text-xs text-slate-500 mt-1">{order.paymentMethod}</p>}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Items</h4>
          <div className="space-y-2">
            {order.items.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{item.name}</p>
                  <p className="text-xs text-slate-500">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{formatCurrency(item.total)}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 space-y-1 text-right">
            <p className="text-xs text-slate-500">Subtotal: {formatCurrency(order.subtotal)}</p>
            {order.tax > 0 && <p className="text-xs text-slate-500">Tax: {formatCurrency(order.tax)}</p>}
            {order.shipping > 0 && <p className="text-xs text-slate-500">Shipping: {formatCurrency(order.shipping)}</p>}
            {order.discount > 0 && <p className="text-xs text-red-500">Discount: -{formatCurrency(order.discount)}</p>}
            <p className="text-sm font-bold text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-800">Total: {formatCurrency(order.total)}</p>
          </div>
        </div>

        {order.statusHistory && order.statusHistory.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Status Timeline</h4>
            <div className="space-y-3">
              {order.statusHistory.map((sh, i) => (
                <div key={sh.id} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="p-1 rounded-full bg-slate-200 dark:bg-slate-800">
                      {getStatusIcon(sh.status)}
                    </div>
                    {i < order.statusHistory!.length - 1 && <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mt-1" />}
                  </div>
                  <div className="pb-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white capitalize">{sh.status}</p>
                    {sh.note && <p className="text-xs text-slate-500 dark:text-slate-400">{sh.note}</p>}
                    <p className="text-xs text-slate-400">{formatDate(sh.createdAt)}</p>
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
            {STATUS_OPTIONS.map(s => (
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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), pageSize: '15', search, status: statusFilter });
      const res = await fetch(`/ecommerce/api/orders?${params}`);
      const data = await res.json();
      setOrders(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await fetch(`/ecommerce/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

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
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="all">All Status</option>
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </form>
          <p className="text-sm text-slate-500 dark:text-slate-400">{total} orders total</p>
        </div>

        {loading ? (
          <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border-b border-slate-100 dark:border-slate-800/50 animate-pulse">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-32" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
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
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
                    <th className="text-center py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Items</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                    <th className="text-center py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="text-center py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Payment</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="text-center py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">{order.orderNumber}</td>
                      <td className="py-3 px-4">
                        <p className="text-slate-900 dark:text-white">{order.customer.name}</p>
                        <p className="text-xs text-slate-500">{order.customer.email}</p>
                      </td>
                      <td className="py-3 px-4 text-center text-slate-600 dark:text-slate-400">{order.items.length}</td>
                      <td className="py-3 px-4 text-right font-medium text-slate-900 dark:text-white">{formatCurrency(order.total)}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getPaymentBadge(order.paymentStatus)}`}>
                          {order.paymentStatus}
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

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">Page {page} of {totalPages}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
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
