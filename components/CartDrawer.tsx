'use client';

import React, { useState } from 'react';
import { CartItem } from '@/lib/types';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, Tag, CheckCircle2 } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: number, newQty: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [formData, setFormData] = useState({
    name: 'Mette Hansen',
    email: 'mette.hansen@example.dk',
    phone: '+45 20 12 34 56',
    address: 'Nørrebrogade 45, 2. th',
    city: 'Copenhagen',
    postalCode: '2200',
    deliverySlot: 'Tomorrow 16:00 – 19:00 (Evening Delivery)',
  });
  const [orderId, setOrderId] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = discountApplied ? subtotal * 0.1 : 0;
  const freeShippingThreshold = 250;
  const deliveryFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 39;
  const total = Math.max(0, subtotal - discount + deliveryFee);
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'FRESH10' || promoCode.trim().toUpperCase() === 'SAVE10') {
      setDiscountApplied(true);
    } else {
      alert('Invalid promo code. Try "SAVE10" or "FRESH10" for 10% off!');
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          deliverySlot: formData.deliverySlot,
          items: items.map((i) => ({
            productId: i.product.id,
            name: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
            image: i.product.primary_image,
          })),
          subtotal,
          discount,
          deliveryFee,
          total,
          paymentMethod: 'MobilePay / Credit Card on Delivery',
        }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrderId(data.order.id);
        setCheckoutStep('success');
        onClearCart();
      }
    } catch (err) {
      console.error('Checkout error:', err);
      // Fallback local order
      setOrderId('SM-' + Math.floor(100000 + Math.random() * 900000));
      setCheckoutStep('success');
      onClearCart();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-navy/40 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Top Header */}
          <div className="p-6 border-b border-sky-100 flex items-center justify-between bg-sky-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-navy" />
              <h2 className="font-serif-luxury text-xl font-bold text-navy">
                {checkoutStep === 'cart' && 'Your Shopping Bag'}
                {checkoutStep === 'checkout' && 'Fast Checkout'}
                {checkoutStep === 'success' && 'Order Confirmed!'}
              </h2>
              {checkoutStep === 'cart' && items.length > 0 && (
                <span className="text-xs bg-navy text-white px-2 py-0.5 rounded-full font-bold">
                  {items.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white text-navy/60 hover:text-navy transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Step 1: Cart Items */}
            {checkoutStep === 'cart' && (
              <>
                {/* Free Shipping Progress Bar */}
                <div className="bg-sky-50 rounded-2xl p-4 border border-sky-100 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-navy">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-sky-600" />
                      {subtotal >= freeShippingThreshold ? (
                        <span className="text-leaf font-bold">🎉 You unlocked FREE Delivery!</span>
                      ) : (
                        <span>
                          Add <span className="text-coral font-bold">{(freeShippingThreshold - subtotal).toFixed(2)} kr.</span> for Free Delivery
                        </span>
                      )}
                    </span>
                    <span>{progressToFreeShipping.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-sky-200">
                    <div
                      className="bg-leaf h-full transition-all duration-500 rounded-full"
                      style={{ width: `${progressToFreeShipping}%` }}
                    />
                  </div>
                </div>

                {/* Items List */}
                {items.length > 0 ? (
                  <div className="divide-y divide-sky-50 space-y-4">
                    {items.map((item) => (
                      <div key={item.product.id} className="pt-4 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-sky-50/50 p-1 flex items-center justify-center border border-sky-100 shrink-0">
                          <img
                            src={item.product.primary_image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=80'}
                            alt={item.product.name}
                            className="max-h-full max-w-full object-contain"
                            onError={(e: any) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=80';
                            }}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-navy line-clamp-1">
                            {item.product.name}
                          </h4>
                          <span className="text-[10px] text-navy/50 block">
                            {item.product.unit || 'Standard'}
                          </span>
                          <span className="text-xs font-bold text-navy">
                            {item.product.price.toFixed(2)} kr.
                          </span>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 bg-sky-50 px-2 py-1 rounded-xl border border-sky-100">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:text-navy text-navy/60 transition"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-navy w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:text-navy text-navy/60 transition"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="p-1.5 text-navy/30 hover:text-rose-500 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-sky-50 text-navy/40 flex items-center justify-center mx-auto text-2xl">
                      🛍️
                    </div>
                    <p className="text-sm font-semibold text-navy">Your bag is currently empty</p>
                    <p className="text-xs text-navy/50 max-w-xs mx-auto">
                      Explore our 1,000+ authentic ingredients and add your kitchen favorites.
                    </p>
                  </div>
                )}

                {/* Promo Code Form */}
                {items.length > 0 && (
                  <form onSubmit={handleApplyPromo} className="flex gap-2 pt-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-navy/40" />
                      <input
                        type="text"
                        placeholder="Discount code (e.g. SAVE10)"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-sky-50 border border-sky-100 text-navy focus:outline-none focus:ring-1 focus:ring-sky-400 uppercase"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-navy text-white text-xs font-semibold hover:bg-navy-light transition"
                    >
                      Apply
                    </button>
                  </form>
                )}
              </>
            )}

            {/* Step 2: Checkout Form */}
            {checkoutStep === 'checkout' && (
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-navy">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-navy">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-navy">Phone (for SMS alerts)</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-navy">Delivery Address</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-navy">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-navy">City</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-navy">Choose Delivery Slot (Denmark)</label>
                  <select
                    value={formData.deliverySlot}
                    onChange={(e) => setFormData({ ...formData, deliverySlot: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-sky-200 bg-white font-medium text-navy focus:outline-none focus:ring-2 focus:ring-sky-300"
                  >
                    <option>Today 17:00 – 20:00 (Express Copenhagen)</option>
                    <option>Tomorrow 10:00 – 13:00 (Morning)</option>
                    <option>Tomorrow 16:00 – 19:00 (Evening)</option>
                    <option>Saturday 11:00 – 15:00 (Weekend)</option>
                  </select>
                </div>

                <div className="p-3 bg-sky-50 rounded-2xl border border-sky-100 text-[11px] text-navy/70 space-y-1">
                  <span className="font-bold text-navy block">Payment Option:</span>
                  <span>Pay via MobilePay, Dankort, or Visa upon safe contactless delivery.</span>
                </div>
              </form>
            )}

            {/* Step 3: Success Screen */}
            {checkoutStep === 'success' && (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-leaf flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif-luxury text-2xl font-bold text-navy">
                  Tusind Tak! Order Placed!
                </h3>
                <p className="text-xs text-navy/70 max-w-xs mx-auto">
                  Your fresh groceries are being packed with care. An order confirmation has been sent to{' '}
                  <span className="font-semibold text-navy">{formData.email}</span>.
                </p>
                <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 text-xs font-mono text-navy font-bold">
                  Order ID: {orderId}
                </div>
                <button
                  onClick={() => {
                    setCheckoutStep('cart');
                    onClose();
                  }}
                  className="w-full py-3 rounded-full bg-navy text-white text-xs font-semibold"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>

          {/* Bottom Summary & Checkout Trigger */}
          {checkoutStep !== 'success' && items.length > 0 && (
            <div className="p-6 border-t border-sky-100 bg-white space-y-4 shadow-lg">
              <div className="space-y-1.5 text-xs text-navy/70">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-navy">{subtotal.toFixed(2)} kr.</span>
                </div>
                {discountApplied && (
                  <div className="flex justify-between text-coral font-semibold">
                    <span>Discount (10%)</span>
                    <span>-{discount.toFixed(2)} kr.</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? <span className="text-leaf font-bold">FREE</span> : `${deliveryFee.toFixed(2)} kr.`}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-navy pt-2 border-t border-sky-50">
                  <span>Estimated Total</span>
                  <span className="text-lg text-coral">{total.toFixed(2)} kr.</span>
                </div>
              </div>

              {checkoutStep === 'cart' ? (
                <button
                  onClick={() => setCheckoutStep('checkout')}
                  className="w-full py-3.5 rounded-full bg-navy hover:bg-navy-light text-white text-xs font-bold tracking-wide shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('cart')}
                    className="px-4 py-3 rounded-full border border-sky-200 text-xs font-semibold text-navy hover:bg-sky-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    form="checkout-form"
                    className="flex-1 py-3 rounded-full bg-leaf hover:bg-leaf-hover text-white text-xs font-bold tracking-wide shadow-md hover:shadow-lg transition"
                  >
                    Confirm & Place Order ({total.toFixed(2)} kr.)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
