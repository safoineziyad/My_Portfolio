'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, Star, ShoppingCart, ArrowLeft, Store, Clock, Shield, Loader2, Plus, Minus, CheckCircle2 } from 'lucide-react';

interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  images: string;
  vatCategory: string;
  createdAt: string;
  vendor: {
    id: string;
    businessName: string;
    slug: string;
    description: string | null;
    logo: string | null;
    rating: number;
    responseTime: string | null;
    isApproved: boolean;
  };
  category: { id: string; name: string; slug: string } | null;
  reviews: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: { id: string; name: string; avatar: string | null };
  }[];
  averageRating: number;
  reviewCount: number;
  relatedProducts: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice: number | null;
    images: string;
    vendor: { businessName: string; rating: number };
    averageRating: number;
    reviewCount: number;
  }[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/ecommerce/api/marketplace/products/${params.slug}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        setProduct(data);
      } catch {
        router.push('/ecommerce/store/products');
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.slug, router]);

  async function handleAddToCart() {
    const stored = localStorage.getItem('marketplace_user');
    if (!stored) {
      router.push('/ecommerce/store/auth');
      return;
    }
    const user = JSON.parse(stored);
    setAddingToCart(true);
    try {
      await fetch('/ecommerce/api/marketplace/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, productId: product!.id, quantity }),
      });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch {} finally {
      setAddingToCart(false);
    }
  }

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    const stored = localStorage.getItem('marketplace_user');
    if (!stored) { router.push('/ecommerce/store/auth'); return; }
    const user = JSON.parse(stored);
    setSubmittingReview(true);
    try {
      await fetch('/ecommerce/api/marketplace/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, productId: product!.id, rating: reviewRating, comment: reviewComment }),
      });
      setReviewComment('');
      setReviewRating(5);
      const res = await fetch(`/ecommerce/api/marketplace/products/${params.slug}`);
      setProduct(await res.json());
    } catch {} finally {
      setSubmittingReview(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!product) return null;

  const savings = product.compareAtPrice && product.compareAtPrice > product.price
    ? product.compareAtPrice - product.price
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="w-full aspect-square bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950/30 dark:to-purple-950/30 flex items-center justify-center">
            <Package className="w-24 h-24 text-indigo-300 dark:text-indigo-700" />
          </div>
          <div className="flex gap-2 p-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-800">
                <Package className="w-6 h-6 text-indigo-300 dark:text-indigo-700" />
              </div>
            ))}
          </div>
        </div>

        <div>
          {product.category && (
            <Link
              href={`/ecommerce/store/products?category=${product.category.slug}`}
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {product.category.name}
            </Link>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-2 mb-4">{product.name}</h1>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.round(product.averageRating) ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
              ))}
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">{product.averageRating} ({product.reviewCount} reviews)</span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <>
                <span className="text-lg text-slate-400 dark:text-slate-500 line-through">${product.compareAtPrice.toFixed(2)}</span>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">Save ${savings.toFixed(2)}</span>
              </>
            )}
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">{product.description || 'No description available.'}</p>

          <div className="flex items-center gap-4 mb-6">
            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${
              product.stock > 10 ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400' :
              product.stock > 0 ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400' :
              'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400'
            }`}>
              {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
            </span>
          </div>

          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-medium text-slate-900 dark:text-white">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-60"
              >
                {addedToCart ? (
                  <><CheckCircle2 className="w-4 h-4" /> Added to Cart</>
                ) : addingToCart ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <><ShoppingCart className="w-4 h-4" /> Add to Cart</>
                )}
              </button>
            </div>
          )}

          <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-4 mt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{product.vendor.businessName}</p>
                {product.vendor.isApproved && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400">Verified Seller</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {product.vendor.responseTime || 'Within 24h'}</span>
              <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Buyer Protection</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Reviews ({product.reviewCount})</h2>

        <form onSubmit={handleSubmitReview} className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-5 mb-6">
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((r) => (
              <button key={r} type="button" onClick={() => setReviewRating(r)}>
                <Star className={`w-5 h-5 ${r <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
              </button>
            ))}
          </div>
          <textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Write a review..."
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none mb-3"
          />
          <button
            type="submit"
            disabled={submittingReview}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-60"
          >
            {submittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Review'}
          </button>
        </form>

        <div className="space-y-4">
          {product.reviews.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">No reviews yet. Be the first to review this product.</p>
          ) : (
            product.reviews.map((review) => (
              <div key={review.id} className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 dark:text-indigo-400 text-xs font-medium">
                        {review.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{review.user.name}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                    ))}
                  </div>
                </div>
                {review.comment && <p className="text-sm text-slate-600 dark:text-slate-400">{review.comment}</p>}
              </div>
            ))
          )}
        </div>
      </div>

      {product.relatedProducts.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {product.relatedProducts.map((rp) => (
              <Link
                key={rp.id}
                href={`/ecommerce/store/products/${rp.slug}`}
                className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:border-indigo-500/30 transition-all group"
              >
                <div className="w-full h-40 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950/30 dark:to-purple-950/30 flex items-center justify-center">
                  <Package className="w-10 h-10 text-indigo-300 dark:text-indigo-700" />
                </div>
                <div className="p-4">
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-1">{rp.vendor.businessName}</p>
                  <h3 className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-indigo-600 line-clamp-2 mb-2">{rp.name}</h3>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">${rp.price.toFixed(2)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
