'use client';

import React from 'react';
import { Category } from '@/lib/types';
import { Sparkles, UtensilsCrossed, Flame, Coffee, HeartPulse, Wheat, Droplets, Cookie, Leaf } from 'lucide-react';

interface CategoryGridProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (catName: string) => void;
}

export default function CategoryGrid({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryGridProps) {
  // Curated category icons
  const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('vegetable') || n.includes('produce')) return <Leaf className="w-5 h-5 text-leaf" />;
    if (n.includes('spice') || n.includes('masala')) return <Flame className="w-5 h-5 text-amber-600" />;
    if (n.includes('tea') || n.includes('coffe')) return <Coffee className="w-5 h-5 text-emerald-600" />;
    if (n.includes('lentil') || n.includes('daal') || n.includes('bean')) return <Wheat className="w-5 h-5 text-amber-700" />;
    if (n.includes('oil') || n.includes('ghee')) return <Droplets className="w-5 h-5 text-sky-600" />;
    if (n.includes('snack') || n.includes('cookie') || n.includes('sweet')) return <Cookie className="w-5 h-5 text-orange-500" />;
    if (n.includes('beauty') || n.includes('health')) return <HeartPulse className="w-5 h-5 text-rose-500" />;
    return <UtensilsCrossed className="w-5 h-5 text-navy" />;
  };

  const topCats = [
    { name: 'All', count: 975 },
    { name: 'Vegetables', count: 45 },
    { name: 'Herbs and Spices', count: 153 },
    { name: 'Ready Masala', count: 132 },
    { name: 'Bean, Peas, Lentils and Daal', count: 50 },
    { name: 'Snack & savories', count: 58 },
    { name: 'Oil & Ghee', count: 24 },
    { name: 'Tea & Coffe', count: 27 },
    { name: 'Beauty & Health', count: 18 },
  ];

  return (
    <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
        <div>
          <span className="text-xs font-bold tracking-widest text-sky-800 uppercase block mb-1">
            EXPLORE SUPERMARKET AISLES
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-navy">
            Shop by Department
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-navy/70 max-w-md font-medium">
          Over 975+ authentic items organized into fresh departments, imported directly to Denmark.
        </p>
      </div>

      {/* Categories Horizontal Carousel / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
        {topCats.map((cat) => {
          const isSelected =
            selectedCategory.toLowerCase() === cat.name.toLowerCase() ||
            (cat.name === 'All' && (!selectedCategory || selectedCategory === 'All'));
          return (
            <button
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className={`p-3 rounded-2xl flex flex-col items-center justify-center text-center transition-all ${
                isSelected
                  ? 'bg-navy text-white shadow-md scale-105 ring-2 ring-sky-300'
                  : 'bg-white hover:bg-sky-50 text-navy border border-sky-100 shadow-card hover:shadow-soft'
              }`}
            >
              <div className={`p-2.5 rounded-xl mb-2 ${isSelected ? 'bg-white/15' : 'bg-sky-50'}`}>
                {getCategoryIcon(cat.name)}
              </div>
              <span className="text-xs font-bold line-clamp-1">
                {cat.name}
              </span>
              <span className={`text-[10px] mt-0.5 font-medium ${isSelected ? 'text-white/70' : 'text-navy/50'}`}>
                {cat.count} items
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
