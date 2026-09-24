'use client';

import React, { useState } from 'react';
import { ArrowRight, MapPin, CheckCircle2, Leaf, Truck } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  onViewRoutine: () => void;
  onSelectCategory?: (cat: string) => void;
}

export default function Hero({ onExplore, onSelectCategory }: HeroProps) {
  const [postcode, setPostcode] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState<string | null>(null);

  const handleCheckDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postcode.trim()) return;
    const num = parseInt(postcode.trim(), 10);
    if (isNaN(num)) {
      setDeliveryStatus('Please enter a valid 4-digit Danish postal code.');
      return;
    }
    if (num >= 1000 && num <= 2999) {
      setDeliveryStatus(`✅ Greater Copenhagen (${num}): Express delivery available!`);
    } else if (num >= 3000 && num <= 9999) {
      setDeliveryStatus(`✅ Denmark Mainland (${num}): Next-day nationwide delivery!`);
    } else {
      setDeliveryStatus('Please enter a valid Danish postal code (1000–9990).');
    }
  };

  return (
    <section id="hero" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6">
      {/* Light Blue Hero Card matching FreshKart reference */}
      <div className="relative rounded-[2rem] bg-[#EAF4FD] overflow-hidden px-6 sm:px-12 py-10 sm:py-14 border border-sky-100 shadow-xs">
        
        {/* Playful Hand-Drawn Doodle Accents (Reference Style) */}
        {/* Top left rays doodle */}
        <div className="absolute top-6 left-10 text-sky-400/80 pointer-events-none hidden sm:block">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M10 25 L4 20 M16 16 L12 8 M25 10 L30 4" stroke="#4A90E2" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Scattered leaf doodles */}
        <div className="absolute top-1/3 left-[42%] text-leaf/60 pointer-events-none hidden md:block animate-float-gentle">
          <Leaf className="w-5 h-5" />
        </div>
        <div className="absolute bottom-8 left-[38%] text-leaf/50 pointer-events-none hidden md:block">
          <Leaf className="w-4 h-4 rotate-45" />
        </div>
        <div className="absolute bottom-10 right-12 text-leaf/70 pointer-events-none hidden lg:block">
          <Leaf className="w-6 h-6 -rotate-12" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Heading, Copy, CTA & Delivery Check */}
          <div className="lg:col-span-6 space-y-5">
            {/* Top Subtitle with Doodles */}
            <div className="flex items-center gap-2">
              <span className="font-doodle text-sm sm:text-base text-sky-800 font-bold tracking-wider">
                Freshness • Quality • Everyday
              </span>
              <span className="text-sky-500 font-doodle text-lg">✨</span>
            </div>

            {/* Big Friendly Rounded Headline */}
            <div className="relative">
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-[#0F2844] leading-[1.08] tracking-tight">
                Groceries <br />
                <span className="text-[#0F2844]">Made Easy</span>
              </h1>
              {/* Cute Heart Doodle */}
              <span className="font-doodle text-2xl text-sky-700 absolute top-1 sm:top-2 left-[270px] sm:left-[340px] hidden xs:inline">
                ♡
              </span>
            </div>

            <p className="text-navy/75 text-sm sm:text-base max-w-md leading-relaxed font-semibold">
              Fresh produce, daily essentials and all your favourite South Asian & international brands — delivered right to your door.
            </p>

            {/* Action Row: Green "Shop Now →" Button */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                onClick={onExplore}
                className="px-8 py-3.5 rounded-full bg-[#228B22] hover:bg-[#1B6F1B] text-white font-black text-sm sm:text-base tracking-wide shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2.5"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick Postcode Lookup Drawer Toggle */}
              <form onSubmit={handleCheckDelivery} className="flex items-center bg-white/90 rounded-full border border-sky-200/80 p-1 pl-3 shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-sky-700 shrink-0 mr-1" />
                <input
                  type="text"
                  placeholder="Postcode (e.g. 2200)"
                  value={postcode}
                  onChange={(e) => {
                    setPostcode(e.target.value);
                    setDeliveryStatus(null);
                  }}
                  className="w-28 text-xs font-bold text-navy placeholder:text-navy/40 bg-transparent focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-full bg-[#0F2844] hover:bg-sky-800 text-white text-[11px] font-bold transition"
                >
                  Check
                </button>
              </form>
            </div>

            {deliveryStatus && (
              <div className="text-xs font-bold text-[#0F2844] px-3 py-1.5 bg-white/80 rounded-xl border border-sky-200 inline-block">
                {deliveryStatus}
              </div>
            )}
          </div>

          {/* Right Column: Tote Bag with Fresh Produce & Hand-Drawn Annotations */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end items-center">
            
            {/* Top-Right Hand-Drawn Annotation: "From our farm to your home ♡" */}
            <div className="absolute -top-4 sm:top-2 right-4 sm:right-6 text-right z-20 hidden sm:block">
              <span className="font-doodle text-base sm:text-lg text-sky-900 font-bold block leading-tight">
                From our farm <br /> to your home ♡
              </span>
              <svg className="ml-auto mt-1 text-sky-600 w-8 h-8 -rotate-12" viewBox="0 0 40 40" fill="none">
                <path d="M30 5 C25 20, 15 25, 5 30 M5 30 L12 25 M5 30 L8 35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Grocery Tote Bag Centerpiece */}
            <div className="relative z-10 w-full max-w-lg">
              <div className="relative rounded-3xl overflow-hidden shadow-md bg-white/20 p-2">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80"
                  alt="Fresh groceries in tote bag delivered"
                  className="w-full h-72 sm:h-96 object-cover rounded-2xl"
                />
                
                {/* Tote Bag Stamp Overlay */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xs px-4 py-2 rounded-2xl shadow-md border border-sky-100 text-center">
                  <span className="font-doodle text-sm sm:text-base font-bold text-[#0F2844] flex items-center gap-1.5">
                    ✨ Fresh & Authentic South Asian Groceries ♡
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
