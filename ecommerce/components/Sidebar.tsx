'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/ecommerce/lib/utils';
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3,
  Settings, ChevronLeft, ChevronRight, Store, Bell, Search,
  Menu, X, ShieldCheck, UsersRound, AlertTriangle, StoreIcon,
  ExternalLink, UserCog, Globe,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useUIStore } from '@/ecommerce/store/ui';

const navItems = [
  { href: '/ecommerce/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/ecommerce/dashboard/products', label: 'Products', icon: Package },
  { href: '/ecommerce/dashboard/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/ecommerce/dashboard/customers', label: 'Customers', icon: Users },
  { href: '/ecommerce/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/ecommerce/dashboard/team', label: 'Team', icon: UsersRound },
  { href: '/ecommerce/dashboard/moderation', label: 'Moderation', icon: ShieldCheck },
  { href: '/ecommerce/dashboard/vendors', label: 'Vendors', icon: StoreIcon },
  { href: '/ecommerce/dashboard/disputes', label: 'Disputes', icon: AlertTriangle },
  { href: '/ecommerce/dashboard/marketplace-settings', label: 'Mkt Settings', icon: Settings },
  { href: '/ecommerce/store', label: 'View Store', icon: ExternalLink, external: true },
  { href: '/ecommerce/dashboard/settings', label: 'Settings', icon: Settings },
];

const searchablePages = [
  { label: 'Dashboard', href: '/ecommerce/dashboard', keywords: ['dashboard', 'home', 'overview'] },
  { label: 'Products', href: '/ecommerce/dashboard/products', keywords: ['products', 'items', 'inventory', 'stock'] },
  { label: 'Orders', href: '/ecommerce/dashboard/orders', keywords: ['orders', 'purchases', 'transactions'] },
  { label: 'Customers', href: '/ecommerce/dashboard/customers', keywords: ['customers', 'users', 'people'] },
  { label: 'Analytics', href: '/ecommerce/dashboard/analytics', keywords: ['analytics', 'charts', 'reports', 'revenue'] },
  { label: 'Settings', href: '/ecommerce/dashboard/settings', keywords: ['settings', 'config', 'preferences'] },
  { label: 'Team', href: '/ecommerce/dashboard/team', keywords: ['team', 'members', 'users', 'roles'] },
  { label: 'Moderation', href: '/ecommerce/dashboard/moderation', keywords: ['moderation', 'approve', 'reject', 'listings'] },
  { label: 'Vendors', href: '/ecommerce/dashboard/vendors', keywords: ['vendors', 'sellers', 'stores'] },
  { label: 'Disputes', href: '/ecommerce/dashboard/disputes', keywords: ['disputes', 'complaints', 'issues'] },
  { label: 'Marketplace Settings', href: '/ecommerce/dashboard/marketplace-settings', keywords: ['marketplace', 'commission', 'platform'] },
  { label: 'Vendor Panel', href: '/ecommerce/vendor', keywords: ['vendor', 'seller', 'panel'] },
  { label: 'Public Store', href: '/ecommerce/store', keywords: ['store', 'shop', 'marketplace', 'buy'] },
];

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'order' | 'stock' | 'system';
}

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
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
            <h1 className="font-bold text-slate-900 dark:text-white text-sm truncate">Ziyad Store</h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Admin Dashboard</p>
          </div>
        )}
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/ecommerce/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
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
  );
}

function NotificationPanel({ notifications, onClose, onMarkRead }: {
  notifications: Notification[];
  onClose: () => void;
  onMarkRead: (id: string) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const typeIcon = (type: string) => {
    switch (type) {
      case 'order': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'stock': return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
      default: return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div ref={panelRef} className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl z-50">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
          <X size={16} />
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-400">No notifications</div>
        ) : (
          notifications.map(n => (
            <button
              key={n.id}
              onClick={() => onMarkRead(n.id)}
              className={cn(
                'w-full text-left px-4 py-3 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors',
                !n.read && 'bg-indigo-50/50 dark:bg-indigo-900/10'
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn('p-1.5 rounded-lg mt-0.5 flex-shrink-0', typeIcon(n.type))}>
                  {n.type === 'order' ? <ShoppingCart size={12} /> : n.type === 'stock' ? <Package size={12} /> : <Bell size={12} />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{n.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{n.message}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{n.time}</p>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export function TopBar({ title }: { title: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { searchQuery, setSearchQuery } = useUIStore();
  const [showSearch, setShowSearch] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [searchResults, setSearchResults] = useState<typeof searchablePages>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Notification state (from API)
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    fetch('/ecommerce/api/notifications')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setNotifications(data);
      })
      .catch(() => {});
  }, []);

  const handleMarkRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    await fetch(`/ecommerce/api/notifications/${id}`, { method: 'PATCH' }).catch(() => {});
  };

  // Search functionality
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === 'Escape') setShowSearch(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchInput = (value: string) => {
    setLocalSearch(value);
    if (value.trim().length === 0) {
      setSearchResults([]);
      return;
    }
    const q = value.toLowerCase();
    const matched = searchablePages.filter(p =>
      p.label.toLowerCase().includes(q) || p.keywords.some(k => k.includes(q))
    );
    setSearchResults(matched);
  };

  const navigateToResult = (href: string) => {
    router.push(href);
    setShowSearch(false);
    setLocalSearch('');
    setSearchResults([]);
  };

  return (
    <>
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Global Search */}
          <div ref={searchRef} className="relative">
            <button
              onClick={() => { setShowSearch(true); setTimeout(() => inputRef.current?.focus(), 50); }}
              className="hidden md:flex items-center gap-2 px-3 h-9 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-64 hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-text"
            >
              <Search size={14} className="text-slate-400" />
              <span className="text-sm text-slate-400 flex-1 text-left">{localSearch || 'Search...'}</span>
              <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-slate-200 dark:bg-slate-800 rounded">
                ⌘K
              </kbd>
            </button>
            {showSearch && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl z-50">
                <div className="flex items-center gap-2 px-3 border-b border-slate-200 dark:border-slate-800">
                  <Search size={14} className="text-slate-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={localSearch}
                    onChange={e => handleSearchInput(e.target.value)}
                    placeholder="Search pages... (e.g. products, orders)"
                    className="flex-1 py-3 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
                  />
                </div>
                {searchResults.length > 0 && (
                  <div className="p-2">
                    {searchResults.map(p => (
                      <button
                        key={p.href}
                        onClick={() => navigateToResult(p.href)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                      >
                        <Search size={14} className="text-slate-400" />
                        <span>{p.label}</span>
                      </button>
                    ))}
                  </div>
                )}
                {localSearch && searchResults.length === 0 && (
                  <div className="py-6 text-center text-sm text-slate-400">No results found</div>
                )}
                {!localSearch && (
                  <div className="p-3">
                    <p className="text-xs text-slate-400 mb-2">Quick Navigation</p>
                    {searchablePages.map(p => (
                      <button
                        key={p.href}
                        onClick={() => navigateToResult(p.href)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                      >
                        <Search size={12} className="text-slate-300" />
                        <span>{p.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <NotificationPanel
                notifications={notifications}
                onClose={() => setShowNotifications(false)}
                onMarkRead={handleMarkRead}
              />
            )}
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 ml-1">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              ZS
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white">
                <Store size={18} />
              </div>
              <h1 className="font-bold text-slate-900 dark:text-white text-sm">Ziyad Store</h1>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/ecommerce/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900'
                    )}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
