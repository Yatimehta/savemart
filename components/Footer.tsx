'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Heart } from 'lucide-react';

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
    <footer className="bg-[#DCEBF8] border-t border-sky-200/70 pt-16 pb-12 mt-20 text-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row: Newsletter / Get in Touch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-14 border-b border-sky-200/80">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-serif-luxury text-2xl font-bold tracking-wider text-navy">
                SAVEMART
              </span>
              <span className="text-amber-500 text-sm">✿</span>
            </div>
            <p className="text-xs sm:text-sm text-navy/75 max-w-sm leading-relaxed">
              Your authentic gateway to fresh South Asian & international groceries delivered to every door across Denmark.
            </p>
          </div>

          {/* GET IN TOUCH Newsletter Box */}
          <div className="lg:col-span-7 space-y-3">
            <span className="text-xs font-bold tracking-widest uppercase text-navy/80 block">
              GET IN TOUCH & EXCLUSIVE OFFERS
            </span>
            <form onSubmit={handleSubscribe} className="relative max-w-md flex">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-5 pr-14 py-3.5 rounded-full bg-white/90 border border-white text-xs text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center hover:bg-navy-light transition shadow-sm"
                aria-label="Submit newsletter"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            {subscribed && (
              <p className="text-xs text-leaf font-bold flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" /> Tusind tak! You are now subscribed for fresh weekly drops.
              </p>
            )}
          </div>
        </div>

        {/* Middle Directory Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 text-xs border-b border-sky-200/80">
          <div className="space-y-3">
            <h4 className="font-bold tracking-wider text-navy uppercase text-[11px]">EXPLORE</h4>
            <ul className="space-y-2 text-navy/70">
              <li><a href="#hero" className="hover:text-navy transition">Home</a></li>
              <li><a href="#routine" className="hover:text-navy transition">Cooking Routine (01–05)</a></li>
              <li><a href="#categories" className="hover:text-navy transition">Category Aisles</a></li>
              <li><a href="#recipes" className="hover:text-navy transition">Recipe Bundles</a></li>
              <li><a href="#catalog" className="hover:text-navy transition">All 975 Groceries</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold tracking-wider text-navy uppercase text-[11px]">HELP & FAQ'S</h4>
            <ul className="space-y-2 text-navy/70">
              <li><span className="hover:text-navy cursor-pointer">Delivery Schedule & Slots</span></li>
              <li><span className="hover:text-navy cursor-pointer">Danish Postcode Coverage</span></li>
              <li><span className="hover:text-navy cursor-pointer">Return & Freshness Guarantee</span></li>
              <li><span className="hover:text-navy cursor-pointer">Terms & Conditions</span></li>
              <li><span className="hover:text-navy cursor-pointer">Privacy Notice</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold tracking-wider text-navy uppercase text-[11px]">ABOUT US</h4>
            <ul className="space-y-2 text-navy/70">
              <li><span className="hover:text-navy cursor-pointer">Our Heritage & Sourcing</span></li>
              <li><span className="hover:text-navy cursor-pointer">Direct Import Partners</span></li>
              <li><span className="hover:text-navy cursor-pointer">Fresh Cold-Chain Quality</span></li>
              <li><span className="hover:text-navy cursor-pointer">Community In Denmark</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold tracking-wider text-navy uppercase text-[11px]">CONTACTS</h4>
            <ul className="space-y-2 text-navy/70">
              <li><span>Copenhagen Warehouse, Denmark</span></li>
              <li><span>kundeservice@savemart.dk</span></li>
              <li><span>+45 31 45 67 89</span></li>
              <li><span>Mon – Sun: 08:00 – 21:00</span></li>
              <li><span>CVR: DK-41928374</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-navy/60 gap-4">
          <p>© {new Date().getFullYear()} SaveMart Denmark. All rights reserved. Modeled faithfully from sabziwala.dk.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for authentic international cuisine in Denmark</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
