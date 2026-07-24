'use client';
import { useEffect, useState } from 'react';
import { TopBar } from '@/ecommerce/components/Sidebar';
import { formatDate } from '@/ecommerce/lib/utils';
import { AlertTriangle, Eye, X, ChevronLeft, ChevronRight, MessageSquare, Search } from 'lucide-react';

interface Dispute {
  id: string;
  reason: string;
  description: string | null;
  status: string;
  resolution: string | null;
  createdAt: string;
  order: {
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    user: { id: string; name: string; email: string };
  };
}

function getStatusBadge(status: string) {
  const map: Record<string, string> = {
    open: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    under_review: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    resolved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    closed: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  };
  return map[status] || 'bg-slate-100 text-slate-600';
}

const STATUS_OPTIONS = ['open', 'under_review', 'resolved', 'closed'];

function DetailModal({
  dispute,
  onClose,
  onUpdate,
}: {
  dispute: Dispute;
  onClose: () => void;
  onUpdate: (id: string, status: string, resolution: string) => void;
}) {
  const [newStatus, setNewStatus] = useState(dispute.status);
  const [resolution, setResolution] = useState(dispute.resolution || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onUpdate(dispute.id, newStatus, resolution);
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
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Dispute Details</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Filed {formatDate(dispute.createdAt)}</p>
          </div>
          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(dispute.status)}`}>
            {dispute.status.replace('_', ' ')}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Order</p>
            <p className="text-sm font-medium text-slate-900 dark:text-white">{dispute.order.orderNumber}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Total: ${dispute.order.total.toFixed(2)}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Filed By</p>
            <p className="text-sm font-medium text-slate-900 dark:text-white">{dispute.order.user.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{dispute.order.user.email}</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Reason</p>
            <p className="text-sm font-medium text-slate-900 dark:text-white">{dispute.reason}</p>
          </div>
          {dispute.description && (
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Description</p>
              <p className="text-sm text-slate-700 dark:text-slate-300">{dispute.description}</p>
            </div>
          )}
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
            <select
              value={newStatus}
              onChange={e => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Resolution Notes</label>
            <textarea
              rows={4}
              value={resolution}
              onChange={e => setResolution(e.target.value)}
              placeholder="Enter resolution notes..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            />
          </div>
          <div className="flex items-center justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Update Dispute'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchDisputes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: '15',
        status: statusFilter,
      });
      const res = await fetch(`/ecommerce/api/admin/marketplace/disputes?${params}`);
      const data = await res.json();
      setDisputes(data.data);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, [page, statusFilter]);

  const handleUpdate = async (id: string, status: string, resolution: string) => {
    setUpdating(true);
    try {
      await fetch('/ecommerce/api/admin/marketplace/disputes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, resolution }),
      });
      fetchDisputes();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <TopBar title="Disputes" />
      <div className="p-4 lg:p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Dispute Resolution</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Review and resolve customer disputes</p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg w-fit flex-wrap">
          {['all', ...STATUS_OPTIONS].map(tab => (
            <button
              key={tab}
              onClick={() => { setStatusFilter(tab); setPage(1); }}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                statusFilter === tab
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab === 'all' ? 'All' : tab.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border-b border-slate-100 dark:border-slate-800/50 animate-pulse">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-36" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24" />
              </div>
            ))}
          </div>
        ) : disputes.length === 0 ? (
          <div className="text-center py-20">
            <AlertTriangle size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-700" />
            <p className="text-slate-500 dark:text-slate-400">No disputes found</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Order</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Reason</th>
                    <th className="text-center py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Filed By</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="text-center py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {disputes.map(dispute => (
                    <tr key={dispute.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">{dispute.order.orderNumber}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 max-w-[200px] truncate">{dispute.reason}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(dispute.status)}`}>
                          {dispute.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{dispute.order.user.name}</td>
                      <td className="py-3 px-4 text-right text-slate-500 dark:text-slate-400">{formatDate(dispute.createdAt)}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setSelectedDispute(dispute)}
                            className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            title="View details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => setSelectedDispute(dispute)}
                            className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            title="Add resolution"
                          >
                            <MessageSquare size={16} />
                          </button>
                        </div>
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
            <p className="text-sm text-slate-500 dark:text-slate-400">Page {page} of {totalPages} &middot; {total} disputes</p>
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

      {selectedDispute && (
        <DetailModal
          dispute={selectedDispute}
          onClose={() => setSelectedDispute(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
