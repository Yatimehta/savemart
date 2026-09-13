'use client';

import React, { useState } from 'react';
import { Trophy, ArrowUpRight, Sparkles, CheckCircle2, MapPin, Search } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  onViewRoutine: () => void;
}

export default function Hero({ onExplore, onViewRoutine }: HeroProps) {
  const [postcode, setPostcode] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState<string | null>(null);

  const handleCheckDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postcode.trim()) return;
    const num = parseInt(postcode.trim(), 10);
    if (isNaN(num)) {
      setDeliveryStatus('Please enter a valid Danish 4-digit postal code (e.g., 2200).');
      return;
    }
    if (num >= 1000 && num <= 2999) {
      setDeliveryStatus(`✅ Greater Copenhagen (${num}): Same-day express delivery available!`);
    } else if (num >= 3000 && num <= 9999) {
      setDeliveryStatus(`✅ Denmark Mainland (${num}): Next-day nationwide delivery available!`);
    } else {
      setDeliveryStatus('Please enter a valid Danish postal code (1000-9990).');
    }
  };

  return (
    <section id="hero" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
      {/* Sky Blue Container */}
      <div className="relative rounded-[2.5rem] sky-gradient-hero overflow-hidden px-6 sm:px-12 py-16 sm:py-24 border border-white/60 shadow-soft">
        {/* Giant Watermark Typography */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-serif-luxury font-black text-white/55 text-[18vw] leading-none tracking-widest uppercase transform translate-y-2">
            SAVEMART
          </span>
          <span className="absolute top-[22%] left-[28%] text-amber-300/80 text-4xl sm:text-7xl font-sans animate-float-gentle">
            ✿
          </span>
        </div>

        {/* Floating Sparkle Stars */}
        <div className="absolute top-10 right-14 text-white/70 text-2xl animate-pulse">✦</div>
        <div className="absolute bottom-20 left-12 text-sky-200 text-3xl animate-float-gentle">✧</div>
        <div className="absolute top-1/2 left-1/3 text-white/40 text-xl">✦</div>

        {/* Content Grid */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column Copy & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-white/80 text-navy text-xs font-semibold tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Authentic Flavors • Direct Import to Denmark</span>
            </div>

            <h1 className="font-serif-luxury text-4xl sm:text-6xl font-bold text-navy leading-[1.15] tracking-tight">
              Pure Essentials, <br />
              <span className="italic font-normal text-sky-800">Fresh from Source</span> to Your Table.
            </h1>

            <p className="text-navy/75 text-base sm:text-lg max-w-lg leading-relaxed font-normal">
              Welcome to SaveMart Denmark, where we bring you over 975+ handpicked South Asian spices, fresh exotic produce, authentic daals, and premium grocery essentials.
            </p>

            {/* Postcode Delivery Checker */}
            <form onSubmit={handleCheckDelivery} className="bg-white/80 backdrop-blur-md p-2 rounded-2xl border border-white max-w-md shadow-xs space-y-2">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-700" />
                  <input
                    type="text"
                    placeholder="Enter Danish Postcode (e.g. 2200 København)"
                    value={postcode}
                    onChange={(e) => {
                      setPostcode(e.target.value);
                      setDeliveryStatus(null);
                    }}
                    className="w-full pl-9 pr-3 py-2 text-xs font-medium text-navy placeholder:text-navy/50 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-navy hover:bg-navy-light text-white text-xs font-bold transition shadow-xs"
                >
                  Check Slot
                </button>
              </div>
              {deliveryStatus && (
                <div className="text-[11px] font-semibold text-sky-900 px-2 py-1 bg-sky-100/70 rounded-lg">
                  {deliveryStatus}
                </div>
              )}
            </form>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                onClick={onExplore}
                className="px-8 py-4 rounded-full bg-navy hover:bg-navy-light text-white font-semibold text-sm tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition active:scale-95 flex items-center gap-2 group"
              >
                <span>Shop All Groceries</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
              </button>

              <button
                onClick={onViewRoutine}
                className="px-7 py-4 rounded-full bg-white/80 hover:bg-white text-navy font-semibold text-sm tracking-wide border border-white shadow-sm hover:shadow transition"
              >
                Cooking Routine (01–05)
              </button>
            </div>

            {/* Quick Guarantees */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-navy/70 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-leaf" /> Same-day Dispatch in Copenhagen
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-leaf" /> 100% Halal & Quality Certified
              </div>
            </div>
          </div>

          {/* Right Column: Fresh Grocery Centerpiece */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            <div className="absolute w-72 sm:w-96 h-72 sm:h-96 bg-white/40 rounded-full blur-3xl -z-0"></div>

            <div className="relative z-10 w-full max-w-md animate-float-gentle">
              <div className="relative rounded-3xl overflow-hidden shadow-float bg-white/40 p-3 backdrop-blur-sm border border-white/60">
                <img
                  src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&auto=format&fit=crop&q=80"
                  alt="Fresh South Asian Produce & Groceries"
                  className="w-full h-80 sm:h-96 object-cover rounded-2xl"
                />
              </div>

              {/* Quality & Fresh Guarantee Badge */}
              <div className="absolute -top-4 -right-2 sm:-right-6 glass-pill px-4 py-2.5 rounded-2xl flex items-center gap-2.5 z-20">
                <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-800">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-navy">Fresh Direct Import</span>
                  <span className="block text-[10px] text-navy/60">Daily South Asian Produce</span>
                </div>
              </div>

              <div className="absolute -bottom-10 right-8 text-navy/40 hidden sm:block">
                <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 5C15 25 35 30 50 15M50 15L42 16M50 15L48 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-[10px] font-serif-luxury italic text-navy/60 absolute -right-2 top-8 whitespace-nowrap">
                  Fresh Daily
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
