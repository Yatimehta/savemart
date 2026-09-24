'use client';

import React from 'react';
import { Truck, ShieldCheck, Leaf, Headphones } from 'lucide-react';

export default function TrustInfoBar() {
  const trustItems = [
    {
      icon: Truck,
      iconColor: 'text-[#0F2844]',
      title: 'Fast & Reliable Delivery',
      subtitle: 'Get your groceries, on time in Denmark.',
    },
    {
      icon: ShieldCheck,
      iconColor: 'text-sky-700',
      title: 'Freshness Guaranteed',
      subtitle: 'Only authentic, premium quality.',
    },
    {
      icon: Leaf,
      iconColor: 'text-[#228B22]',
      title: 'Wide Range',
      subtitle: 'Over 975+ products in one place.',
    },
    {
      icon: Headphones,
      iconColor: 'text-sky-800',
      title: '24/7 Support',
      subtitle: 'We are here to help anytime.',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 4-Item Trust Info Strip matching FreshKart reference */}
      <div className="bg-[#EDF5FD] rounded-2xl p-4 sm:p-6 border border-sky-100/90 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-sky-200/50">
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`flex items-center gap-3.5 ${
                  idx !== 0 ? 'pt-3 sm:pt-0 sm:pl-4 lg:pl-6' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-2xs border border-sky-100">
                  <Icon className={`w-5 h-5 ${item.iconColor}`} />
                </div>
                <div>
                  <h4 className="font-heading text-xs sm:text-sm font-extrabold text-[#0F2844] leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-navy/60 font-medium mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
