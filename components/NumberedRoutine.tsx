'use client';

import React from 'react';
import { Product } from '@/lib/types';
import { ShoppingCart, Eye, Sparkles, ChevronRight } from 'lucide-react';

interface NumberedRoutineProps {
  routineProducts: (Product & { stepNumber: string; stepLabel: string })[];
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export default function NumberedRoutine({
  routineProducts,
  onAddToCart,
  onQuickView,
}: NumberedRoutineProps) {
  // Reliable image fallback
  const getSafeImage = (p: Product) => {
    if (p.primary_image && !p.primary_image.includes('–')) {
      return p.primary_image;
    }
    return `https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80`;
  };

  return (
    <section id="routine" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Section Header (Directly modeled after Reference Image 1 "HAIR CARE") */}
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>The Daily Ritual</span>
        </div>
        <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-navy tracking-tight uppercase">
          COOKING ROUTINE
        </h2>
        <p className="text-xs sm:text-sm font-semibold tracking-wider text-navy/60 uppercase max-w-xl mx-auto leading-relaxed">
          WE'RE BRINGING AUTHENTIC FLAVOR TO EACH STEP OF YOUR DAILY COOKING RITUAL
        </p>
      </div>

      {/* Numbered Row 01, 02, 03, 04, 05 (Exact BeautyBoo layout) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
        {routineProducts.map((item) => {
          return (
            <div
              key={item.id}
              className="group flex flex-col items-center text-center relative transition-transform duration-300 hover:-translate-y-1.5"
            >
              {/* Step Number (01, 02, 03, 04, 05) */}
              <div className="w-full text-left font-serif-luxury text-xl sm:text-2xl font-bold text-navy/40 group-hover:text-sky-600 transition pl-2">
                {item.stepNumber}
              </div>

              {/* Product Container */}
              <div className="relative w-full aspect-[3/4] bg-white rounded-3xl p-4 my-3 flex items-center justify-center border border-sky-50 shadow-card group-hover:shadow-soft group-hover:border-sky-200 transition-all overflow-hidden">
                {/* Product Image */}
                <img
                  src={getSafeImage(item)}
                  alt={item.name}
                  className="max-h-[85%] max-w-[85%] object-contain transition-transform duration-500 group-hover:scale-105"
                  onError={(e: any) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80';
                  }}
                />

                {/* Floating Quick Actions on Hover */}
                <div className="absolute inset-0 bg-navy/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={() => onQuickView(item)}
                    className="p-3 bg-white text-navy rounded-full shadow-lg hover:bg-sky-50 transition transform translate-y-2 group-hover:translate-y-0"
                    title="Quick View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onAddToCart(item)}
                    className="p-3 bg-coral text-white rounded-full shadow-lg hover:bg-coral-hover transition transform translate-y-2 group-hover:translate-y-0"
                    title="Add to Cart"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="w-full space-y-1 px-1">
                <span className="text-[10px] font-bold tracking-widest text-sky-700 uppercase block">
                  {item.stepLabel}
                </span>
                <h3 className="text-xs sm:text-sm font-semibold text-navy line-clamp-1 group-hover:text-sky-800 transition">
                  {item.name}
                </h3>
                <div className="text-sm font-bold text-navy">
                  {item.price.toFixed(2)} {item.currency_symbol || 'kr.'}
                </div>
                <button
                  onClick={() => onQuickView(item)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-navy/60 hover:text-sky-700 tracking-wider uppercase pt-1 transition"
                >
                  <span>SEE MORE</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
