'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/types';
import { X, ShoppingCart, Check, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export default function QuickViewModal({
  product,
  onClose,
  onAddToCart,
}: QuickViewModalProps) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, qty);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-navy/40 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-sky-100 z-10 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-sky-50 text-navy/60 hover:text-navy transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Image */}
          <div className="aspect-square rounded-2xl bg-sky-50/50 p-6 flex items-center justify-center border border-sky-100">
            <img
              src={product.primary_image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80'}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
              onError={(e: any) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80';
              }}
            />
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-sky-800 tracking-wider uppercase">
                {product.main_category || 'Groceries'}
              </span>
              <h3 className="font-serif-luxury text-2xl font-bold text-navy leading-tight">
                {product.name}
              </h3>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-black text-navy">
                {product.price.toFixed(2)} {product.currency_symbol || 'kr.'}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-leaf-light text-leaf border border-leaf/20">
                In Stock & Fresh
              </span>
            </div>

            <p className="text-xs text-navy/70 leading-relaxed">
              {product.description ||
                `Fresh, authentic ${product.name} imported directly to ensure original taste, fragrance, and premium quality. Perfect for daily family cooking.`}
            </p>

            <div className="text-xs space-y-1 text-navy/60">
              <div><strong className="text-navy">Unit/Weight:</strong> {product.unit || 'Standard Pack'}</div>
              <div><strong className="text-navy">Country of Origin:</strong> Denmark & South Asia</div>
            </div>

            {/* Quantity and Add */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center border border-sky-200 rounded-full bg-sky-50 px-3 py-2">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-2 text-navy font-bold hover:text-sky-700"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-bold text-navy">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-2 text-navy font-bold hover:text-sky-700"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                className={`flex-1 py-3 px-6 rounded-full text-xs font-bold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 ${
                  added
                    ? 'bg-leaf text-white'
                    : 'bg-coral hover:bg-coral-hover text-white'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" /> Add to Cart — {(product.price * qty).toFixed(2)} kr.
                  </>
                )}
              </button>
            </div>

            {/* Trust highlights */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-[10px] text-navy/60 border-t border-sky-50">
              <div className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-sky-600" /> Fast Courier Delivery
              </div>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-leaf" /> 100% Quality Checked
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
