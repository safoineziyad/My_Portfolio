'use client';
import { useEffect, useState } from 'react';
import { TopBar } from '@/ecommerce/components/Sidebar';
import { formatDate } from '@/ecommerce/lib/utils';
import { Store, Eye, CheckCircle, XCircle, X, Users, Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface Vendor {
  id: string;
  businessName: string;
  slug: string;
  description: string | null;
  logo: string | null;
  taxId: string | null;
  businessAddress: string | null;
  phone: string | null;
  email: string;
  rating: number | null;
  responseTime: number | null;
  isApproved: boolean;
  isActive: boolean;
  commissionRate: number;
  productCount: number;
  createdAt: string;
}

function getStatusBadge(vendor: Vendor) {
  if (!vendor.isApproved) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
  if (!vendor.isActive) return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
}

function getStatusLabel(vendor: Vendor) {
  if (!vendor.isApproved) return 'Pending';
  if (!vendor.isActive) return 'Inactive';
  return 'Approved';
}

function DetailModal({
  vendor,
  onClose,
  onApprove,
  onDeactivate,
}: {
  vendor: Vendor;
  onClose: () => void;
  onApprove: (id: string) => void;
  onDeactivate: (id: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
          <X size={18} />
        </button>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
            {vendor.logo ? (
              <img src={vendor.logo} alt={vendor.businessName} className="w-14 h-14 rounded-xl object-cover" />
            ) : (
              <Store size={24} className="text-indigo-600" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{vendor.businessName}</h3>
            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(vendor)}`}>
              {getStatusLabel(vendor)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Email</p>
            <p className="text-sm font-medium text-slate-900 dark:text-white">{vendor.email}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Phone</p>
            <p className="text-sm font-medium text-slate-900 dark:text-white">{vendor.phone || 'Not provided'}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Tax ID</p>
            <p className="text-sm font-medium text-slate-900 dark:text-white">{vendor.taxId || 'Not provided'}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Commission Rate</p>
            <p className="text-sm font-medium text-slate-900 dark:text-white">{vendor.commissionRate}%</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Rating</p>
            <div className="flex items-center gap-1">
              <Star size={14} className="text-amber-400 fill-amber-400" />
              <p className="text-sm font-medium text-slate-900 dark:text-white">{vendor.rating?.toFixed(1) || 'N/A'}</p>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Products</p>
            <p className="text-sm font-medium text-slate-900 dark:text-white">{vendor.productCount}</p>
          </div>
        </div>

        {vendor.businessAddress && (
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 mb-6">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Business Address</p>
            <p className="text-sm text-slate-700 dark:text-slate-300">{vendor.businessAddress}</p>
          </div>
        )}

        {vendor.description && (
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 mb-6">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Description</p>
            <p className="text-sm text-slate-700 dark:text-slate-300">{vendor.description}</p>
          </div>
        )}

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Joined {formatDate(vendor.createdAt)}</p>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          {!vendor.isApproved && (
            <button
              onClick={() => { onApprove(vendor.id); onClose(); }}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              Approve Vendor
            </button>
          )}
          {vendor.isActive && (
            <button
              onClick={() => { onDeactivate(vendor.id); onClose(); }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Deactivate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: '15',
        status: statusFilter,
      });
      const res = await fetch(`/ecommerce/api/admin/marketplace/vendors?${params}`);
      const data = await res.json();
      setVendors(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [page, statusFilter]);

  const handleVendorUpdate = async (id: string, update: { isApproved?: boolean; isActive?: boolean }) => {
    setUpdating(id);
    try {
      await fetch('/ecommerce/api/admin/marketplace/vendors', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...update }),
      });
      fetchVendors();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <TopBar title="Vendor Management" />
      <div className="p-4 lg:p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Vendor Management</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage marketplace vendors and their access</p>
        </div>

        <div className="flex items-center gap-2">
          {['all', 'pending', 'approved'].map(tab => (
            <button
              key={tab}
              onClick={() => { setStatusFilter(tab); setPage(1); }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                statusFilter === tab
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
          <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">{total} vendors</span>
        </div>

        {loading ? (
          <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border-b border-slate-100 dark:border-slate-800/50 animate-pulse">
                <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-32" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-28" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-12" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24" />
              </div>
            ))}
          </div>
        ) : vendors.length === 0 ? (
          <div className="text-center py-20">
            <Users size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-700" />
            <p className="text-slate-500 dark:text-slate-400">No vendors found</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Vendor</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                    <th className="text-center py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Rating</th>
                    <th className="text-center py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="text-center py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Products</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Joined</th>
                    <th className="text-center py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map(vendor => (
                    <tr key={vendor.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                            {vendor.logo ? (
                              <img src={vendor.logo} alt={vendor.businessName} className="w-9 h-9 rounded-lg object-cover" />
                            ) : (
                              <Store size={16} className="text-indigo-600" />
                            )}
                          </div>
                          <span className="font-medium text-slate-900 dark:text-white">{vendor.businessName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{vendor.email}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star size={12} className="text-amber-400 fill-amber-400" />
                          <span className="text-slate-900 dark:text-white">{vendor.rating?.toFixed(1) || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(vendor)}`}>
                          {getStatusLabel(vendor)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-slate-600 dark:text-slate-400">{vendor.productCount}</td>
                      <td className="py-3 px-4 text-right text-slate-500 dark:text-slate-400">{formatDate(vendor.createdAt)}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setSelectedVendor(vendor)}
                            className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            title="View details"
                          >
                            <Eye size={16} />
                          </button>
                          {!vendor.isApproved && (
                            <button
                              onClick={() => handleVendorUpdate(vendor.id, { isApproved: true })}
                              disabled={updating === vendor.id}
                              className="p-2 rounded-lg text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors disabled:opacity-50"
                              title="Approve"
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}
                          {vendor.isActive && (
                            <button
                              onClick={() => handleVendorUpdate(vendor.id, { isActive: false })}
                              disabled={updating === vendor.id}
                              className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                              title="Deactivate"
                            >
                              <XCircle size={16} />
                            </button>
                          )}
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

      {selectedVendor && (
        <DetailModal
          vendor={selectedVendor}
          onClose={() => setSelectedVendor(null)}
          onApprove={(id) => handleVendorUpdate(id, { isApproved: true })}
          onDeactivate={(id) => handleVendorUpdate(id, { isActive: false })}
        />
      )}
    </div>
  );
}
