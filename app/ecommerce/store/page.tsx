'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Package, Star, Tag, ShoppingBag, TrendingUp } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  images: string;
  featured: boolean;
  vendor: { businessName: string; rating: number };
  averageRating: number;
  reviewCount: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  productCount: number;
}

const categoryIcons: Record<string, string> = {
  electronics: '📱',
  clothing: '👕',
  home: '🏠',
  sports: '⚽',
  books: '📚',
  beauty: '💄',
  toys: '🎮',
  automotive: '🚗',
};

export default function StoreHomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/ecommerce/api/marketplace/products?pageSize=8&featured=true'),
          fetch('/ecommerce/api/marketplace/categories'),
        ]);
        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        setFeaturedProducts(productsData.data || []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);

        const recentRes = await fetch('/ecommerce/api/marketplace/products?pageSize=8&sort=newest');
        const recentData = await recentRes.json();
        setRecentProducts(recentData.data || []);
      } catch (err) {
        console.error('Failed to load store data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <section className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-purple-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Welcome to <br />
              <span className="text-indigo-200">Ziyad Market</span>
            </h1>
            <p className="text-lg text-indigo-100 mb-8 max-w-lg">
              Discover unique products from trusted sellers worldwide. Quality guaranteed, fast shipping.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/ecommerce/store/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-colors"
              >
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/ecommerce/store/auth/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500/20 text-white border border-indigo-400/30 font-semibold rounded-xl hover:bg-indigo-500/30 transition-colors"
              >
                Become a Seller
              </Link>
            </div>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Browse Categories</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Find exactly what you&apos;re looking for</p>
            </div>
            <Link href="/ecommerce/store/products" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/ecommerce/store/products?category=${cat.slug}`}
                className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-5 text-center hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors group"
              >
                <div className="text-3xl mb-3">
                  {categoryIcons[cat.icon || ''] || cat.icon || '📦'}
                </div>
                <h3 className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{cat.productCount} products</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Featured Products</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Handpicked by our team</p>
              </div>
            </div>
            <Link href="/ecommerce/store/products" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {recentProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recent Arrivals</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Just added to the marketplace</p>
              </div>
            </div>
            <Link href="/ecommerce/store/products?sort=newest" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-5 animate-pulse">
                <div className="w-full h-40 bg-slate-200 dark:bg-slate-800 rounded-lg mb-4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Start Selling Today</h2>
          <p className="text-indigo-100 mb-6 max-w-md mx-auto">
            Join hundreds of sellers on Ziyad Market. Set up your store in minutes.
          </p>
          <Link
            href="/ecommerce/store/auth/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-colors"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  let images: string[] = [];
  try {
    images = JSON.parse(product.images);
  } catch {}

  return (
    <Link
      href={`/ecommerce/store/products/${product.slug}`}
      className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:border-indigo-500/30 transition-all group"
    >
      <div className="relative w-full h-48 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950/30 dark:to-purple-950/30 flex items-center justify-center">
        <Package className="w-12 h-12 text-indigo-300 dark:text-indigo-700" />
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <span className="absolute top-3 left-3 px-2 py-0.5 bg-red-500 text-white text-xs font-medium rounded-full">
            {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% off
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-1 truncate">
          {product.vendor.businessName}
        </p>
        <h3 className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 mb-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < Math.round(product.averageRating)
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-slate-300 dark:text-slate-600'
              }`}
            />
          ))}
          <span className="text-xs text-slate-400 dark:text-slate-500 ml-1">({product.reviewCount})</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            ${product.price.toFixed(2)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-sm text-slate-400 dark:text-slate-500 line-through">
              ${product.compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
