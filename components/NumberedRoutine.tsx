'use client';

import React from 'react';
import { Product } from '@/lib/types';
import { ShoppingBag, Eye, Sparkles, ChevronRight, Plus, Check } from 'lucide-react';

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
  const [addedId, setAddedId] = React.useState<number | null>(null);

  // Reliable image fallback
  const getSafeImage = (p: Product) => {
    if (p.primary_image && !p.primary_image.includes('–')) {
      return p.primary_image;
    }
    return `https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80`;
  };

  const handleAdd = (item: Product) => {
    onAddToCart(item);
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  return (
    <section id="routine" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-900 text-xs font-bold tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>The Everyday South Asian Kitchen</span>
        </div>
        <h2 className="font-heading text-2xl sm:text-4xl font-black text-navy tracking-tight uppercase">
          Daily Cooking Routine (01–05)
        </h2>
        <p className="text-xs sm:text-sm font-semibold tracking-wide text-navy/70 uppercase max-w-xl mx-auto leading-relaxed">
          Essential pantry building blocks for authentic home-cooked curries and daily meals
        </p>
      </div>

      {/* Numbered Row 01, 02, 03, 04, 05 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
        {routineProducts.map((item) => {
          return (
            <div
              key={item.id}
              className="group bg-white rounded-2xl p-3.5 border border-sky-100/90 shadow-card hover:shadow-soft hover:border-sky-300 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Step Header */}
              <div className="flex items-center justify-between border-b border-sky-50 pb-2">
                <span className="font-heading text-lg font-black text-sky-700 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-100">
                  {item.stepNumber}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-900 line-clamp-1">
                  {item.stepLabel}
                </span>
              </div>

              {/* Product Container */}
              <div 
                onClick={() => onQuickView(item)}
                className="relative w-full aspect-square bg-sky-50/30 rounded-xl p-3 my-2.5 flex items-center justify-center cursor-pointer overflow-hidden"
              >
                <img
                  src={getSafeImage(item)}
                  alt={item.name}
                  className="max-h-[85%] max-w-[85%] object-contain transition-transform duration-500 group-hover:scale-105"
                  onError={(e: any) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80';
                  }}
                  loading="lazy"
                />

                {/* Quick View Floating Pill */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickView(item);
                  }}
                  className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-white/90 text-navy shadow-sm hover:bg-white transition opacity-0 group-hover:opacity-100"
                  title="Quick View"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Product Info & Quick Action */}
              <div className="w-full space-y-2">
                <h3 
                  onClick={() => onQuickView(item)}
                  className="text-xs font-bold text-navy line-clamp-2 leading-tight group-hover:text-sky-800 transition cursor-pointer min-h-[2rem]"
                >
                  {item.name}
                </h3>

                <div className="flex items-center justify-between pt-1 border-t border-sky-50">
                  <div>
                    <span className="text-xs font-black text-navy">
                      {item.price > 0 ? item.price.toFixed(2) : '25.00'}{' '}
                      <span className="text-[10px] font-semibold text-navy/60">
                        {item.currency_symbol || 'kr.'}
                      </span>
                    </span>
                  </div>

                  <button
                    onClick={() => handleAdd(item)}
                    className={`p-2 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center justify-center ${
                      addedId === item.id
                        ? 'bg-leaf text-white px-2.5'
                        : 'bg-navy hover:bg-navy-light text-white shadow-xs'
                    }`}
                    title="Add to Cart"
                  >
                    {addedId === item.id ? (
                      <span className="flex items-center gap-1 text-[10px]">
                        <Check className="w-3 h-3" /> Added
                      </span>
                    ) : (
                      <Plus className="w-3.5 h-3.5 text-sky-200" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
