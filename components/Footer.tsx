'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Heart, ShoppingBag, Leaf, ShieldCheck, Truck } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-[#DCEBF8] border-t border-sky-200/70 pt-14 pb-12 mt-16 text-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row: Newsletter / Get in Touch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-sky-200/80">
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-navy text-white flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-sky-200" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black text-2xl tracking-tight text-navy">
                  SAVEMART
                </span>
                <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-leaf-light text-leaf border border-leaf/20">
                  DK
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-navy/80 max-w-sm leading-relaxed font-medium">
              Your authentic gateway to fresh South Asian & international groceries delivered straight to your door anywhere in Denmark.
            </p>
            <div className="flex items-center gap-4 text-xs font-bold text-navy/80 pt-1">
              <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-sky-700" /> Fast Dispatch</span>
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-leaf" /> 100% Halal</span>
              <span className="flex items-center gap-1"><Leaf className="w-3.5 h-3.5 text-leaf" /> Fresh Direct</span>
            </div>
          </div>

          {/* GET IN TOUCH Newsletter Box */}
          <div className="lg:col-span-7 space-y-3">
            <span className="text-xs font-black tracking-widest uppercase text-navy/90 block">
              WEEKLY FRESH DROPS & SPECIAL OFFERS
            </span>
            <form onSubmit={handleSubscribe} className="relative max-w-md flex">
              <input
                type="email"
                required
                placeholder="Enter your email for fresh arrivals..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-5 pr-14 py-3 rounded-xl bg-white/95 border border-sky-200 text-xs font-semibold text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-2xs"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-navy text-white flex items-center justify-center hover:bg-navy-light transition shadow-2xs"
                aria-label="Submit newsletter"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            {subscribed && (
              <p className="text-xs text-leaf font-bold flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" /> Mange tak! You are now subscribed for fresh weekly drops.
              </p>
            )}
          </div>
        </div>

        {/* Middle Directory Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 text-xs border-b border-sky-200/80">
          <div className="space-y-3">
            <h4 className="font-extrabold tracking-wider text-navy uppercase text-[11px]">SUPERMARKET AISLES</h4>
            <ul className="space-y-2 text-navy/70 font-semibold">
              <li><a href="#hero" className="hover:text-navy transition">Home</a></li>
              <li><a href="#routine" className="hover:text-navy transition">Cooking Routine (01–05)</a></li>
              <li><a href="#categories" className="hover:text-navy transition">Category Departments</a></li>
              <li><a href="#catalog" className="hover:text-navy transition">All 975 Groceries</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-extrabold tracking-wider text-navy uppercase text-[11px]">CUSTOMER SERVICE</h4>
            <ul className="space-y-2 text-navy/70 font-semibold">
              <li><span className="hover:text-navy cursor-pointer">Delivery Slots & Coverage</span></li>
              <li><span className="hover:text-navy cursor-pointer">Danish Postcode Lookup</span></li>
              <li><span className="hover:text-navy cursor-pointer">Freshness Guarantee Policy</span></li>
              <li><span className="hover:text-navy cursor-pointer">Terms & Conditions</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-extrabold tracking-wider text-navy uppercase text-[11px]">ABOUT SAVEMART</h4>
            <ul className="space-y-2 text-navy/70 font-semibold">
              <li><span className="hover:text-navy cursor-pointer">Authentic Direct Sourcing</span></li>
              <li><span className="hover:text-navy cursor-pointer">Direct Import Partners</span></li>
              <li><span className="hover:text-navy cursor-pointer">Fresh Cold-Chain Logistics</span></li>
              <li><span className="hover:text-navy cursor-pointer">Community in Denmark</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-extrabold tracking-wider text-navy uppercase text-[11px]">CONTACT US</h4>
            <ul className="space-y-2 text-navy/70 font-semibold">
              <li><span>Copenhagen Warehouse, Denmark</span></li>
              <li><span>kundeservice@savingmart.dk</span></li>
              <li><span>+45 31 45 67 89</span></li>
              <li><span>Mon – Sun: 08:00 – 21:00</span></li>
              <li><span>CVR: DK-41928374</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-navy/60 gap-4 font-medium">
          <p>© {new Date().getFullYear()} SaveMart Denmark. Fresh South Asian & International Groceries.</p>
          <div className="flex items-center gap-1">
            <span>Serving authentic international cuisines across Denmark</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
