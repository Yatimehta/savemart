'use client';

import React from 'react';
import { Product } from '@/lib/types';
import { ShoppingCart, Heart, Check } from 'lucide-react';

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

  const getTag = () => {
    const cat = (product.main_category || '').toLowerCase();
    if (cat.includes('veg') || cat.includes('produce') || cat.includes('herb')) {
      return { text: 'Fresh', color: 'bg-[#E8F8F0] text-[#16A34A] border-[#D1F2DF]' };
    }
    if (product.price > 60) {
      return { text: 'Premium', color: 'bg-[#F3E8FF] text-[#9333EA] border-[#E9D5FF]' };
    }
    return { text: 'Best Seller', color: 'bg-[#FFF4E5] text-[#D97706] border-[#FFE2BF]' };
  };

  const tag = getTag();

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group bg-white rounded-2xl p-4 border border-sky-100/80 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer relative"
    >
      {/* Top Right Wishlist Heart */}
      {onToggleWishlist && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className="absolute top-3 right-3 p-1 rounded-full text-navy/30 hover:text-rose-500 hover:bg-rose-50 transition z-10"
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'text-rose-500 fill-rose-500' : ''}`} />
        </button>
      )}

      {/* Centered Product Image */}
      <div className="h-32 sm:h-36 w-full flex items-center justify-center my-2 p-1">
        <img
          src={imgSrc}
          alt={product.name}
          className="max-h-full max-w-[90%] object-contain group-hover:scale-105 transition-transform duration-300"
          onError={() => setImgError(true)}
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

        {/* Price & Badge Tag */}
        <div className="flex items-center gap-2 pt-1 pb-2">
          <span className="font-black text-sm sm:text-base text-[#0F2844]">
            {product.price > 0 ? product.price.toFixed(0) : '25'} {product.currency_symbol || 'kr.'}
          </span>
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${tag.color}`}>
            {tag.text}
          </span>
        </div>

        {/* Full-width "Add to Cart" Light Blue Button */}
        <button
          onClick={handleAdd}
          className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 ${
            addedAnimation
              ? 'bg-[#228B22] text-white'
              : 'bg-[#EAF3FD] hover:bg-[#228B22] text-[#0F2844] hover:text-white'
          }`}
          title="Add to Cart"
        >
          {addedAnimation ? (
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
}
