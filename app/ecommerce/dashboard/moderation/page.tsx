'use client';
import { useEffect, useState } from 'react';
import { TopBar } from '@/ecommerce/components/Sidebar';
import { formatCurrency, formatDate } from '@/ecommerce/lib/utils';
import { Shield, Eye, CheckCircle, XCircle, X, Package, ChevronLeft, ChevronRight } from 'lucide-react';

interface MarketplaceProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  sku: string | null;
  images: string | null;
  status: string;
  featured: boolean;
  createdAt: string;
  vendor: { id: string; businessName: string; email: string };
  category?: { id: string; name: string } | null;
}

const TABS = [
  { key: 'pending', label: 'Pending', icon: Shield },
  { key: 'active', label: 'Approved', icon: CheckCircle },
  { key: 'rejected', label: 'Rejected', icon: XCircle },
  { key: 'all', label: 'All', icon: Package },
];

function getStatusBadge(status: string) {
  const map: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    archived: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  };
  return map[status] || 'bg-slate-100 text-slate-600';
}

function DetailModal({
  product,
  onClose,
  onApprove,
  onReject,
}: {
  product: MarketplaceProduct;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  let parsedImages: string[] = [];
  if (product.images) {
    try {
      const parsed = JSON.parse(product.images);
      if (Array.isArray(parsed)) parsedImages = parsed;
    } catch {
      parsedImages = [product.images];
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
          <X size={18} />
        </button>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{product.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Submitted {formatDate(product.createdAt)}
            </p>
          </div>
          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(product.status)}`}>
            {product.status}
          </span>
        </div>

        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Vendor</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">{product.vendor.businessName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{product.vendor.email}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Category</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">{product.category?.name || 'Uncategorized'}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Price</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(product.price)}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Stock</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">{product.stock}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">SKU</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">{product.sku || 'N/A'}</p>
            </div>
          </div>
          {product.description && (
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Description</p>
              <p className="text-sm text-slate-700 dark:text-slate-300">{product.description}</p>
            </div>
          )}
          {parsedImages.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Images</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {parsedImages.map((url, i) => (
                  <img key={i} src={url} alt={`Product image ${i + 1}`} className="h-24 w-24 object-cover rounded-lg border border-slate-200 dark:border-slate-800 flex-shrink-0" />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => { onReject(product.id); onClose(); }}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Reject
          </button>
          <button
            onClick={() => { onApprove(product.id); onClose(); }}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ModerationPage() {
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceProduct | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: '15',
        status: activeTab,
      });
      const res = await fetch(`/ecommerce/api/admin/marketplace/products?${params}`);
      const data = await res.json();
      setProducts(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, activeTab]);

  const handleStatusUpdate = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await fetch('/ecommerce/api/admin/marketplace/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <TopBar title="Product Moderation" />
      <div className="p-4 lg:p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Product Moderation</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Review and approve vendor product listings</p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg w-fit">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setPage(1); }}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.key
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border-b border-slate-100 dark:border-slate-800/50 animate-pulse">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-40" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-28" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-28" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Package size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-700" />
            <p className="text-slate-500 dark:text-slate-400">No products to review</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Vendor</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                    <th className="text-center py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Submitted</th>
                    <th className="text-center py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-900 dark:text-white">{product.name}</p>
                        <p className="text-xs text-slate-500">{product.sku || product.slug}</p>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{product.vendor.businessName}</td>
                      <td className="py-3 px-4 text-right font-medium text-slate-900 dark:text-white">{formatCurrency(product.price)}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(product.status)}`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-500 dark:text-slate-400">{formatDate(product.createdAt)}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setSelectedProduct(product)}
                            className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            title="View details"
                          >
                            <Eye size={16} />
                          </button>
                          {product.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(product.id, 'active')}
                                disabled={updating === product.id}
                                className="p-2 rounded-lg text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors disabled:opacity-50"
                                title="Approve"
                              >
                                <CheckCircle size={16} />
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(product.id, 'rejected')}
                                disabled={updating === product.id}
                                className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                                title="Reject"
                              >
                                <XCircle size={16} />
                              </button>
                            </>
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
            <p className="text-sm text-slate-500 dark:text-slate-400">Page {page} of {totalPages} &middot; {total} products</p>
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

      {selectedProduct && (
        <DetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onApprove={(id) => handleStatusUpdate(id, 'active')}
          onReject={(id) => handleStatusUpdate(id, 'rejected')}
        />
      )}
    </div>
  );
}
