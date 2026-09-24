'use client';

import React from 'react';
import { ChefHat, ShoppingCart, Clock, Users, ArrowRight, Sparkles, Plus, Check } from 'lucide-react';
import { Product } from '@/lib/types';

interface RecipeBundlesProps {
  onAddBundleToCart: (bundleName: string, items: { name: string; price: number }[]) => void;
}

export default function RecipeBundles({ onAddBundleToCart }: RecipeBundlesProps) {
  const [addedBundle, setAddedBundle] = React.useState<string | null>(null);

  const recipes = [
    {
      id: 'biryani',
      title: 'Royal Biryani Feast',
      prepTime: '45 mins',
      serves: '4-6 persons',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
      description: 'Fragrant aged Basmati rice layered with aromatic Shan spices, golden fried onions, and pure ghee.',
      ingredients: [
        { name: 'Royal Basmati Rice 1Kg', price: 35.0 },
        { name: 'Biryani Masala Whole 200g', price: 28.0 },
        { name: 'Butter Ghee 500ml', price: 65.0 },
        { name: 'Whole Cardamom 50g', price: 35.0 },
      ],
      totalPrice: 163.0,
      bundlePrice: 139.0,
    },
    {
      id: 'dal-tadka',
      title: 'Comfort Dal Tadka & Rice',
      prepTime: '30 mins',
      serves: '4 persons',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
      description: 'Slow-cooked yellow lentils tempered with hot mustard oil, whole red chillies, cumin, and garlic.',
      ingredients: [
        { name: 'Chana Dal Washed 1Kg', price: 35.0 },
        { name: 'Cold-Pressed Mustard Oil 500ml', price: 45.0 },
        { name: 'Whole Long Chilli 150g', price: 40.0 },
        { name: 'Garlic-500g', price: 35.0 },
      ],
      totalPrice: 155.0,
      bundlePrice: 129.0,
    },
    {
      id: 'masala-chai',
      title: 'Authentic Masala Chai Ritual',
      prepTime: '15 mins',
      serves: '4 cups',
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
      description: 'Strong, rich CTC tea infused with crushed green cardamom, cinnamon, and served with crispy milk rusk.',
      ingredients: [
        { name: 'Typhoo Rich Tea 240 bags', price: 65.0 },
        { name: 'Green Cardamom Seeds 50g', price: 35.0 },
        { name: 'Milk Rusk 560g', price: 48.0 },
      ],
      totalPrice: 148.0,
      bundlePrice: 119.0,
    },
  ];

  const handleAdd = (recipe: typeof recipes[0]) => {
    onAddBundleToCart(recipe.title, recipe.ingredients);
    setAddedBundle(recipe.id);
    setTimeout(() => setAddedBundle(null), 2000);
  };

  return (
    <section id="recipes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold tracking-widest uppercase mb-2">
            <ChefHat className="w-3.5 h-3.5 text-sky-600" />
            <span>Cook Like a Chef</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-navy">
            1-Click Meal & Recipe Bundles
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-navy/60 max-w-md">
          Get all authentic ingredients for classic South Asian dishes bundled together with discount savings.
        </p>
      </div>

      {/* Grid of 3 Recipe Bundles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {recipes.map((r) => {
          const isAdded = addedBundle === r.id;
          return (
            <div
              key={r.id}
              className="bg-white rounded-3xl overflow-hidden border border-sky-100 shadow-card hover:shadow-soft hover:border-sky-200 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image & Badges */}
              <div className="relative h-48 sm:h-52 overflow-hidden">
                <img
                  src={r.image}
                  alt={r.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-3 left-3 glass-pill px-3 py-1 rounded-xl text-[11px] font-bold text-navy flex items-center gap-2">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-sky-600" /> {r.prepTime}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3 text-sky-600" /> {r.serves}</span>
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-coral text-white text-[10px] font-bold shadow-xs">
                  Save {(r.totalPrice - r.bundlePrice).toFixed(0)} kr.
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-heading text-lg font-bold text-navy">
                    {r.title}
                  </h3>
                  <p className="text-xs text-navy/70 leading-relaxed">
                    {r.description}
                  </p>
                </div>

                {/* Included ingredients checklist */}
                <div className="bg-sky-50/60 p-3.5 rounded-2xl border border-sky-100 text-xs space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 block">
                    Bundle Includes {r.ingredients.length} Items:
                  </span>
                  <ul className="space-y-1 text-navy/80 text-[11px]">
                    {r.ingredients.map((ing) => (
                      <li key={ing.name} className="flex justify-between items-center">
                        <span className="line-clamp-1">• {ing.name}</span>
                        <span className="font-semibold">{ing.price.toFixed(0)} kr.</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price & 1-Click Add Button */}
                <div className="pt-2 flex items-center justify-between border-t border-sky-50">
                  <div>
                    <span className="text-[10px] text-navy/40 line-through block">
                      {r.totalPrice.toFixed(2)} kr.
                    </span>
                    <span className="text-lg font-black text-navy">
                      {r.bundlePrice.toFixed(2)} <span className="text-xs font-semibold text-navy/60">kr.</span>
                    </span>
                  </div>

                  <button
                    onClick={() => handleAdd(r)}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 shadow-sm ${
                      isAdded
                        ? 'bg-leaf text-white'
                        : 'bg-navy hover:bg-navy-light text-white'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Added to Bag
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5" /> Add All ({r.bundlePrice.toFixed(0)} kr.)
                      </>
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
