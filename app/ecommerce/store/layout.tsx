'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, Search, Menu, X, User, LogOut, ChevronDown } from 'lucide-react';

interface StoreUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<StoreUser | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('marketplace_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        fetchCartCount(parsed.id);
      } catch {
        localStorage.removeItem('marketplace_user');
      }
    }
  }, [pathname]);

  async function fetchCartCount(userId: string) {
    try {
      const res = await fetch(`/ecommerce/api/marketplace/cart?userId=${userId}`);
      const items = await res.json();
      setCartCount(Array.isArray(items) ? items.length : 0);
    } catch {}
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/ecommerce/store/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

  function handleLogout() {
    localStorage.removeItem('marketplace_user');
    setUser(null);
    setCartCount(0);
    router.push('/ecommerce/store');
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <nav className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/ecommerce/store" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Z</span>
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white hidden sm:block">Ziyad Market</span>
            </Link>

            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </form>

            <div className="flex items-center gap-3">
              <Link
                href="/ecommerce/store/cart"
                className="relative p-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-indigo-600 text-white text-xs font-medium rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <div className="w-7 h-7 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 dark:text-indigo-400 text-xs font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden sm:block">{user.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg py-1 z-50">
                        <Link
                          href="/ecommerce/store"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                        <button
                          onClick={() => { handleLogout(); setUserMenuOpen(false); }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/ecommerce/store/auth"
                    className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hidden sm:block"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/ecommerce/store/auth"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors hidden sm:block"
                  >
                    Register
                  </Link>
                </div>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 dark:text-slate-400 md:hidden"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-slate-200 dark:border-slate-800 pt-3">
              <form onSubmit={handleSearch} className="mb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </form>
              <div className="flex flex-col gap-1">
                <Link href="/ecommerce/store/products" className="px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                  All Products
                </Link>
                {!user && (
                  <Link href="/ecommerce/store/auth" className="px-3 py-2 text-sm text-indigo-600 font-medium hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                    Sign in / Register
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <main>{children}</main>

      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">Z</span>
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-white">Ziyad Market</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Your trusted multi-vendor marketplace.</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Shop</h3>
              <div className="flex flex-col gap-2">
                <Link href="/ecommerce/store/products" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600">All Products</Link>
                <Link href="/ecommerce/store/products?sort=newest" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600">New Arrivals</Link>
                <Link href="/ecommerce/store/products?featured=true" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600">Featured</Link>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Account</h3>
              <div className="flex flex-col gap-2">
                <Link href="/ecommerce/store/auth" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600">Sign In</Link>
                <Link href="/ecommerce/store/auth/register" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600">Become a Seller</Link>
                <Link href="/ecommerce/store/cart" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600">Cart</Link>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Support</h3>
              <div className="flex flex-col gap-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">Help Center</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">Contact Us</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">Terms of Service</span>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-sm text-slate-400 dark:text-slate-500">&copy; 2026 Ziyad Market. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
