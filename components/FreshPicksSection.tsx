'use client';

import React from 'react';
import { Product } from '@/lib/types';
import { Leaf, ArrowRight, Heart, ShoppingCart, Check } from 'lucide-react';

interface FreshPicksSectionProps {
  products: Product[];
  onAddToCart: (product: Product, quantity?: number) => void;
  onQuickView: (product: Product) => void;
  wishlistIds: number[];
  onToggleWishlist: (product: Product) => void;
  onViewAll: () => void;
}

export default function FreshPicksSection({
  products,
  onAddToCart,
  onQuickView,
  wishlistIds,
  onToggleWishlist,
  onViewAll,
}: FreshPicksSectionProps) {
  const [addedId, setAddedId] = React.useState<number | null>(null);

  const handleAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onAddToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  // Get 5 representative fresh items from real product data
  const picks = products.slice(0, 5);

  const getTag = (product: Product, index: number) => {
    const cat = (product.main_category || '').toLowerCase();
    if (cat.includes('veg') || cat.includes('produce')) {
      return { text: 'Fresh', color: 'bg-[#E8F8F0] text-[#16A34A] border-[#D1F2DF]' };
    }
    if (index % 3 === 0) {
      return { text: 'Best Seller', color: 'bg-[#FFF4E5] text-[#D97706] border-[#FFE2BF]' };
    }
    if (index % 3 === 1) {
      return { text: 'Fresh', color: 'bg-[#E8F8F0] text-[#16A34A] border-[#D1F2DF]' };
    }
    return { text: 'Premium', color: 'bg-[#F3E8FF] text-[#9333EA] border-[#E9D5FF]' };
  };

  const getSafeImage = (p: Product) => {
    if (p.primary_image && !p.primary_image.includes('–')) {
      return p.primary_image;
    }
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80';
  };

  if (picks.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-[#228B22] fill-[#228B22]" />
          <h2 className="font-heading text-xl sm:text-2xl font-black text-[#0F2844]">
            Fresh Picks for You
          </h2>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs font-bold text-sky-700 hover:text-navy flex items-center gap-1 transition"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 5-Column Grid matching FreshKart reference */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {picks.map((product, idx) => {
          const isWishlisted = wishlistIds.includes(product.id);
          const tag = getTag(product, idx);
          const isAdded = addedId === product.id;

          return (
            <div
              key={product.id}
              onClick={() => onQuickView(product)}
              className="group bg-white rounded-2xl p-4 border border-sky-100/80 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer relative"
            >
              {/* Wishlist Heart Icon (Top Right) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWishlist(product);
                }}
                className="absolute top-3 right-3 p-1 rounded-full text-navy/30 hover:text-rose-500 hover:bg-rose-50 transition z-10"
                aria-label="Wishlist"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isWishlisted ? 'text-rose-500 fill-rose-500' : ''
                  }`}
                />
              </button>

              {/* Product Image */}
              <div className="h-32 sm:h-36 w-full flex items-center justify-center my-2 p-1">
                <img
                  src={getSafeImage(product)}
                  alt={product.name}
                  className="max-h-full max-w-[90%] object-contain group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              {/* Product Details */}
              <div className="space-y-1 pt-1">
                <h3 className="font-heading text-xs sm:text-sm font-bold text-[#0F2844] line-clamp-1 group-hover:text-sky-700 transition">
                  {product.name}
                </h3>
                
                <span className="text-[11px] text-navy/50 font-medium block">
                  {product.unit || 'Standard Pack'}
                </span>

                {/* Price and Badge Tag */}
                <div className="flex items-center gap-2 pt-1 pb-2">
                  <span className="font-black text-sm sm:text-base text-[#0F2844]">
                    {product.price > 0 ? product.price.toFixed(0) : '25'} {product.currency_symbol || 'kr.'}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${tag.color}`}>
                    {tag.text}
                  </span>
                </div>

                {/* Light Blue "Add to Cart" Full Width Button */}
                <button
                  onClick={(e) => handleAdd(e, product)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    isAdded
                      ? 'bg-[#228B22] text-white'
                      : 'bg-[#EAF3FD] hover:bg-[#228B22] text-[#0F2844] hover:text-white'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Added
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
