'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store, LayoutDashboard, Package, ShoppingCart, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/ecommerce/lib/utils';

const navItems = [
  { href: '/ecommerce/vendor', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/ecommerce/vendor/products', label: 'My Products', icon: Package },
  { href: '/ecommerce/vendor/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/ecommerce/vendor/payouts', label: 'Payouts', icon: DollarSign },
];

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      <aside className={cn(
        'hidden lg:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-all duration-300',
        collapsed ? 'w-[68px]' : 'w-64'
      )}>
        <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white flex-shrink-0">
            <Store size={18} />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="font-bold text-slate-900 dark:text-white text-sm truncate">Vendor Panel</h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Seller Dashboard</p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.href === '/ecommerce/vendor'
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white'
                )}
              >
                <item.icon size={18} className="flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-2 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full h-9 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </aside>

      {children}
    </div>
  );
}
