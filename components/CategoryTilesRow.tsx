'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CategoryTilesRowProps {
  onSelectCategory: (catName: string) => void;
}

export default function CategoryTilesRow({ onSelectCategory }: CategoryTilesRowProps) {
  const tiles = [
    {
      name: 'Vegetables',
      label: 'Fruits & Vegetables',
      bgColor: 'bg-[#EAF5FE] hover:bg-[#DDF0FE]',
      arrowColor: 'text-sky-500',
      image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Oil & Ghee',
      label: 'Dairy & Eggs',
      bgColor: 'bg-[#EBF3FD] hover:bg-[#DEECFB]',
      arrowColor: 'text-sky-600',
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Herbs and Spices',
      label: 'Pantry & Spices',
      bgColor: 'bg-[#FFF9EA] hover:bg-[#FFF2D2]',
      arrowColor: 'text-amber-500',
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Snack & savories',
      label: 'Snacks & Beverages',
      bgColor: 'bg-[#EBF7F4] hover:bg-[#DDF2ED]',
      arrowColor: 'text-emerald-500',
      image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Other Flour',
      label: 'Flour & Rice',
      bgColor: 'bg-[#EDF6FB] hover:bg-[#DFEFF8]',
      arrowColor: 'text-blue-500',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Beauty & Health',
      label: 'Personal Care',
      bgColor: 'bg-[#F5EEFB] hover:bg-[#EAE0F8]',
      arrowColor: 'text-purple-500',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* 6 Pastel Category Tiles Grid matching FreshKart reference */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {tiles.map((tile) => (
          <div
            key={tile.name}
            onClick={() => onSelectCategory(tile.name)}
            className={`group ${tile.bgColor} rounded-2xl p-4 flex flex-col justify-between cursor-pointer transition-all duration-200 hover:-translate-y-1 shadow-2xs hover:shadow-xs border border-white/80`}
          >
            {/* Centered Product Cutout / Image */}
            <div className="h-20 sm:h-24 w-full flex items-center justify-center mb-3">
              <img
                src={tile.image}
                alt={tile.label}
                className="max-h-full max-w-[90%] object-contain rounded-xl drop-shadow-xs group-hover:scale-105 transition-transform"
                loading="eager"
              />
            </div>

            {/* Bottom: Category Name + Arrow Icon */}
            <div className="flex items-end justify-between gap-1 pt-1">
              <span className="font-heading text-xs font-extrabold text-[#0F2844] leading-snug">
                {tile.label}
              </span>
              <div className={`w-5 h-5 rounded-full bg-white/70 flex items-center justify-center shrink-0 shadow-2xs group-hover:bg-white group-hover:scale-110 transition-transform ${tile.arrowColor}`}>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
