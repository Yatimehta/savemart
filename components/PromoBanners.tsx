'use client';

import React from 'react';
import { ArrowRight, Leaf } from 'lucide-react';

interface PromoBannersProps {
  onSelectCategory: (catName: string) => void;
}

export default function PromoBanners({ onSelectCategory }: PromoBannersProps) {
  const banners = [
    {
      title: 'Fresh Fruits & Veggies',
      subtitle: 'From farm to your table',
      category: 'Vegetables',
      bgColor: 'bg-[#EAF5EE] border-[#D6EFE0]',
      buttonBg: 'bg-[#0F2844] hover:bg-sky-900 text-white',
      image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400&auto=format&fit=crop&q=80',
      doodle: '🍃',
    },
    {
      title: 'Dairy Essentials & Ghee',
      subtitle: 'Pure. Fresh. Nutritious.',
      category: 'Oil & Ghee',
      bgColor: 'bg-[#EBF7F2] border-[#D6F2E5]',
      buttonBg: 'bg-[#228B22] hover:bg-[#1B6F1B] text-white',
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80',
      doodle: '✨',
    },
    {
      title: 'Snacks & Beverages',
      subtitle: 'Your daily cravings, sorted.',
      category: 'Snack & savories',
      bgColor: 'bg-[#FFF4EB] border-[#FFE5D3]',
      buttonBg: 'bg-[#E67E22] hover:bg-[#CF6D17] text-white',
      image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&auto=format&fit=crop&q=80',
      doodle: '🍪',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      {/* 3 Wide Promotional Banner Cards matching FreshKart reference */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {banners.map((b, idx) => (
          <div
            key={idx}
            className={`${b.bgColor} rounded-2xl p-4 sm:p-5 border flex items-center justify-between gap-3 shadow-2xs relative overflow-hidden`}
          >
            {/* Left: Product Imagery */}
            <div className="w-28 sm:w-32 h-24 sm:h-28 shrink-0 flex items-center justify-center">
              <img
                src={b.image}
                alt={b.title}
                className="max-h-full max-w-full object-contain drop-shadow-xs rounded-xl"
                loading="lazy"
              />
            </div>

            {/* Right: Typography and CTA Button */}
            <div className="flex-1 space-y-2 text-right">
              <div>
                <h3 className="font-doodle text-lg sm:text-xl font-bold text-[#0F2844] leading-tight">
                  {b.title}
                </h3>
                <p className="text-[11px] font-semibold text-navy/70 mt-0.5">
                  {b.subtitle}
                </p>
              </div>

              <div>
                <button
                  onClick={() => onSelectCategory(b.category)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-2xs transition-all active:scale-95 inline-flex items-center gap-1 ${b.buttonBg}`}
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
