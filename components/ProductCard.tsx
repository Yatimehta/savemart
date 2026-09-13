'use client';

import React from 'react';
import { Product } from '@/lib/types';
import { ShoppingCart, Eye, Heart, Check, Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  onQuickView,
  isWishlisted = false,
  onToggleWishlist,
}: ProductCardProps) {
  const [imgError, setImgError] = React.useState(false);
  const [addedAnimation, setAddedAnimation] = React.useState(false);

  // Reliable image fallback
  const imgSrc = imgError || !product.primary_image || product.primary_image.includes('–')
    ? 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80'
    : product.primary_image;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group bg-white rounded-3xl p-4 border border-sky-100 shadow-card hover:shadow-soft hover:border-sky-200 transition-all duration-300 flex flex-col justify-between cursor-pointer relative"
    >
      {/* Top Badges & Wishlist */}
      <div className="flex items-center justify-between z-10">
        <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-100 uppercase">
          {product.unit || 'Standard'}
        </span>
        {onToggleWishlist && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className={`p-1.5 rounded-full transition ${
              isWishlisted
                ? 'bg-rose-50 text-rose-500'
                : 'text-navy/40 hover:text-rose-500 hover:bg-rose-50'
            }`}
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
          </button>
        )}
      </div>

      {/* Product Image */}
      <div className="relative w-full aspect-square my-3 flex items-center justify-center overflow-hidden rounded-2xl bg-sky-50/30">
        <img
          src={imgSrc}
          alt={product.name}
          className="max-h-[85%] max-w-[85%] object-contain transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgError(true)}
          loading="lazy"
        />

        {/* Quick View Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute bottom-2 right-2 p-2 rounded-full bg-white/90 shadow-sm text-navy/80 hover:text-navy opacity-0 group-hover:opacity-100 transition-opacity"
          title="Quick View"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Product Info & CTA */}
      <div className="space-y-2 pt-1">
        <span className="text-[10px] font-semibold text-sky-700 block uppercase tracking-wider line-clamp-1">
          {product.main_category || 'Groceries'}
        </span>

        <h3 className="text-xs sm:text-sm font-semibold text-navy line-clamp-2 leading-snug group-hover:text-sky-800 transition min-h-[2.5rem]">
          {product.name}
        </h3>

        <div className="flex items-center justify-between pt-2 border-t border-sky-50">
          <div>
            <span className="text-xs text-navy/40 block leading-none">Price</span>
            <span className="text-base sm:text-lg font-bold text-navy">
              {product.price > 0 ? product.price.toFixed(2) : '25.00'}{' '}
              <span className="text-xs font-semibold text-navy/60">
                {product.currency_symbol || 'kr.'}
              </span>
            </span>
          </div>

          {/* Add to Cart Food Accent Button */}
          <button
            onClick={handleAdd}
            className={`p-2.5 rounded-full font-semibold text-xs transition-all active:scale-90 flex items-center justify-center ${
              addedAnimation
                ? 'bg-leaf text-white px-3'
                : 'bg-coral hover:bg-coral-hover text-white shadow-xs hover:shadow-md'
            }`}
            title="Add to Cart"
          >
            {addedAnimation ? (
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4" /> Added
              </span>
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
