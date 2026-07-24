'use client';
import { useEffect, useState } from 'react';
import { TopBar } from '@/ecommerce/components/Sidebar';
import { formatCurrency, formatDate, getInitials } from '@/ecommerce/lib/utils';
import { Search, Users, ChevronLeft, ChevronRight, DollarSign, ShoppingCart } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  _count: { orders: number };
  totalSpent: number;
  lastOrderDate: string | null;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), pageSize: '12', search });
      const res = await fetch(`/ecommerce/api/customers?${params}`);
      const data = await res.json();
      setCustomers(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCustomers();
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <TopBar title="Customers" />
      <div className="p-4 lg:p-6 space-y-6">
        <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-md">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search customers..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </form>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-5 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <div className="space-y-1.5">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-28" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-36" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-14 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                  <div className="h-14 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-20">
            <Users size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-700" />
            <p className="text-slate-500 dark:text-slate-400">No customers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customers.map(customer => (
              <div key={customer.id} className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-sm font-bold flex-shrink-0">
                    {getInitials(customer.name)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate">{customer.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{customer.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                    <div className="flex items-center gap-1.5 mb-1">
                      <DollarSign size={12} className="text-emerald-500" />
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Spent</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(customer.totalSpent)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                    <div className="flex items-center gap-1.5 mb-1">
                      <ShoppingCart size={12} className="text-indigo-500" />
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Orders</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{customer._count.orders}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Joined {formatDate(customer.createdAt)}</span>
                  {customer.lastOrderDate && <span>Last order {formatDate(customer.lastOrderDate)}</span>}
                </div>
              </div>
            ))}
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
    </div>
  );
}
