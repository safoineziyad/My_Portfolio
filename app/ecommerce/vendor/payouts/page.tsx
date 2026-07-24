'use client';

import { useEffect, useState } from 'react';
import { TopBar } from '@/ecommerce/components/Sidebar';
import { formatCurrency, formatDate, getStatusColor } from '@/ecommerce/lib/utils';
import { DollarSign, Clock, CheckCircle, XCircle, Plus, X } from 'lucide-react';

interface Payout {
  id: string;
  amount: number;
  status: string;
  method: string | null;
  reference: string | null;
  createdAt: string;
}

interface PayoutSummary {
  totalEarned: number;
  pendingPayout: number;
  completedPayouts: number;
}

function RequestPayoutModal({ vendorId, onClose, onRequested }: { vendorId: string; onClose: () => void; onRequested: () => void }) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank_transfer');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/ecommerce/api/vendor/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorId, amount: parseFloat(amount), method }),
      });
      if (res.ok) {
        onRequested();
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
          <X size={18} />
        </button>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Request Payout</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Method</label>
            <select
              value={method}
              onChange={e => setMethod(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="bank_transfer">Bank Transfer</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50">
              {saving ? 'Requesting...' : 'Request Payout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function VendorPayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [summary, setSummary] = useState<PayoutSummary>({ totalEarned: 0, pendingPayout: 0, completedPayouts: 0 });
  const [loading, setLoading] = useState(true);
  const [vendorId, setVendorId] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem('vendorId') || '';
    setVendorId(id);
  }, []);

  const fetchPayouts = async () => {
    if (!vendorId) return;
    setLoading(true);
    try {
      const res = await fetch(`/ecommerce/api/vendor/payouts?vendorId=${vendorId}`);
      const data = await res.json();
      const list = data.data || data;
      setPayouts(list);

      const totalEarned = list.reduce((sum: number, p: Payout) => p.status === 'completed' ? sum + p.amount : sum, 0);
      const pendingPayout = list.reduce((sum: number, p: Payout) => p.status === 'pending' || p.status === 'processing' ? sum + p.amount : sum, 0);
      const completedPayouts = list.filter((p: Payout) => p.status === 'completed').length;
      setSummary({ totalEarned, pendingPayout, completedPayouts });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vendorId) fetchPayouts();
  }, [vendorId]);

  const statCards = [
    { label: 'Total Earned', value: formatCurrency(summary.totalEarned), icon: DollarSign, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
    { label: 'Pending Payout', value: formatCurrency(summary.pendingPayout), icon: Clock, color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
    { label: 'Completed Payouts', value: summary.completedPayouts.toString(), icon: CheckCircle, color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <TopBar title="Payouts" />
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div />
          <button
            onClick={() => setShowRequestModal(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            <Plus size={16} className="inline mr-1.5" /> Request Payout
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-5 animate-pulse">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24 mb-3" />
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-16" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Payout History</h3>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-slate-100 dark:bg-slate-900 rounded animate-pulse" />
              ))}
            </div>
          ) : payouts.length === 0 ? (
            <div className="py-12 text-center">
              <DollarSign size={40} className="mx-auto mb-3 text-slate-300 dark:text-slate-700" />
              <p className="text-sm text-slate-500 dark:text-slate-400">No payouts yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Method</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Reference</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map(payout => (
                    <tr key={payout.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">{formatCurrency(payout.amount)}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payout.status)}`}>
                          {payout.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 capitalize">{(payout.method || 'N/A').replace('_', ' ')}</td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono text-xs">{payout.reference || '---'}</td>
                      <td className="py-3 px-4 text-right text-slate-500 dark:text-slate-400">{formatDate(payout.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showRequestModal && (
        <RequestPayoutModal vendorId={vendorId} onClose={() => setShowRequestModal(false)} onRequested={fetchPayouts} />
      )}
    </div>
  );
}
