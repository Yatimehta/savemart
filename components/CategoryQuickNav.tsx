'use client';

import React from 'react';
import { 
  Flame, 
  Leaf, 
  Wheat, 
  Cookie, 
  Droplets, 
  Coffee, 
  HeartPulse, 
  Sparkles, 
  ShoppingBag,
  ChevronRight
} from 'lucide-react';

interface QuickNavProps {
  selectedCategory: string;
  onSelectCategory: (catName: string) => void;
}

export default function CategoryQuickNav({
  selectedCategory,
  onSelectCategory,
}: QuickNavProps) {
  const quickAisles = [
    {
      name: 'All',
      label: 'All Aisles',
      count: '975+',
      icon: ShoppingBag,
      iconColor: 'text-navy',
      bgHover: 'hover:border-navy/40',
    },
    {
      name: 'Vegetables',
      label: 'Fresh Produce',
      count: '45 items',
      icon: Leaf,
      iconColor: 'text-leaf',
      bgHover: 'hover:border-leaf/40',
      badge: 'Fresh',
    },
    {
      name: 'Herbs and Spices',
      label: 'Herbs & Spices',
      count: '153 items',
      icon: Flame,
      iconColor: 'text-amber-600',
      bgHover: 'hover:border-amber-500/40',
    },
    {
      name: 'Ready Masala',
      label: 'Recipe Masalas',
      count: '132 items',
      icon: Flame,
      iconColor: 'text-coral',
      bgHover: 'hover:border-coral/40',
    },
    {
      name: 'Bean, Peas, Lentils and Daal',
      label: 'Daals & Pulses',
      count: '50 items',
      icon: Wheat,
      iconColor: 'text-amber-700',
      bgHover: 'hover:border-amber-700/40',
    },
    {
      name: 'Snack & savories',
      label: 'Snacks & Namkeen',
      count: '58 items',
      icon: Cookie,
      iconColor: 'text-orange-500',
      bgHover: 'hover:border-orange-500/40',
    },
    {
      name: 'Oil & Ghee',
      label: 'Oils & Pure Ghee',
      count: '24 items',
      icon: Droplets,
      iconColor: 'text-sky-600',
      bgHover: 'hover:border-sky-500/40',
    },
    {
      name: 'Tea & Coffe',
      label: 'Chai & Beverages',
      count: '27 items',
      icon: Coffee,
      iconColor: 'text-emerald-700',
      bgHover: 'hover:border-emerald-500/40',
    },
    {
      name: 'Beauty & Health',
      label: 'Ayurveda & Care',
      count: '18 items',
      icon: HeartPulse,
      iconColor: 'text-rose-500',
      bgHover: 'hover:border-rose-500/40',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      {/* Quick Nav Bar Container */}
      <div className="bg-white/95 rounded-2xl p-3 sm:p-4 border border-sky-100/90 shadow-card">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-navy flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              Quick Aisle Navigation
            </span>
          </div>
          <span className="text-[11px] font-semibold text-navy/60 hidden sm:inline">
            Click any department to filter catalog
          </span>
        </div>

        {/* Scrollable / Flexible Aisle Pill Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none snap-x">
          {quickAisles.map((aisle) => {
            const isSelected =
              selectedCategory.toLowerCase() === aisle.name.toLowerCase() ||
              (aisle.name === 'All' && (!selectedCategory || selectedCategory === 'All'));
            const Icon = aisle.icon;

            return (
              <button
                key={aisle.name}
                onClick={() => onSelectCategory(aisle.name)}
                className={`snap-start shrink-0 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-navy text-white border-navy shadow-xs ring-2 ring-sky-300'
                    : `bg-sky-50/70 text-navy border-sky-100 ${aisle.bgHover} hover:bg-white hover:shadow-2xs`
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg ${
                    isSelected ? 'bg-white/15' : 'bg-white shadow-2xs'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-sky-200' : aisle.iconColor}`} />
                </div>
                <div className="text-left leading-tight">
                  <div className="flex items-center gap-1">
                    <span>{aisle.label}</span>
                    {aisle.badge && (
                      <span className="text-[9px] bg-leaf text-white font-extrabold px-1 rounded">
                        {aisle.badge}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-medium block ${
                      isSelected ? 'text-white/70' : 'text-navy/50'
                    }`}
                  >
                    {aisle.count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
