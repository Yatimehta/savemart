'use client';

import React, { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { Product, Order } from '@/lib/types';
import { 
  PackageCheck, 
  ShoppingBag, 
  LogOut, 
  Plus, 
  ArrowLeft, 
  ShieldCheck, 
  RefreshCw, 
  Calendar, 
  User, 
  CheckCircle2,
  Boxes
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<'orders' | 'products'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [addingProduct, setAddingProduct] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    main_category: 'Herbs and Spices',
    price: 35.0,
    regular_price: 35.0,
    unit: '500g',
    description: '',
    primary_image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400',
    in_stock: true,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingProduct(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          price: Number(newProduct.price),
          regular_price: Number(newProduct.regular_price),
        }),
      });
      const data = await res.json();
      if (data.id) {
        showToast('Product added successfully to catalog!');
        setNewProduct({
          name: '',
          main_category: 'Herbs and Spices',
          price: 35.0,
          regular_price: 35.0,
          unit: '500g',
          description: '',
          primary_image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400',
          in_stock: true,
        });
      } else {
        alert(data.error || 'Failed to add product');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating product');
    } finally {
      setAddingProduct(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col selection:bg-sky-200">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-navy text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom duration-300">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-sky-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 rounded-xl text-navy/60 hover:text-navy hover:bg-sky-50 transition"
              title="Return to Storefront"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-xl tracking-tight text-navy">
                  SAVEMART
                </span>
                <span className="text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full bg-leaf-light text-leaf font-bold border border-leaf/20">
                  ADMIN
                </span>
              </div>
              <p className="text-[11px] text-navy/60 font-medium">Supermarket Operations & Inventory</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Session Active (8h)</span>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition border border-rose-200/60 active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-sky-100">
          <div className="flex items-center gap-2 bg-sky-100/70 p-1.5 rounded-2xl">
            <button
              onClick={() => setTab('orders')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition ${
                tab === 'orders'
                  ? 'bg-white text-navy shadow-sm'
                  : 'text-navy/70 hover:text-navy'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Live Orders ({orders.length})</span>
            </button>
            <button
              onClick={() => setTab('products')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition ${
                tab === 'products'
                  ? 'bg-white text-navy shadow-sm'
                  : 'text-navy/70 hover:text-navy'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {tab === 'orders' && (
            <button
              onClick={fetchOrders}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy/70 hover:text-navy px-3 py-2 rounded-xl bg-white border border-sky-100 hover:bg-sky-50 shadow-sm transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingOrders ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          )}
        </div>

        {/* Tab 1: Orders Management */}
        {tab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-black text-navy font-heading">Customer Orders</h1>
                <p className="text-xs text-navy/60 font-medium">Real-time incoming orders from Danish storefront</p>
              </div>
            </div>

            {loadingOrders ? (
              <div className="py-20 text-center text-xs text-navy/60 bg-white rounded-3xl border border-sky-100">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-sky-600" />
                <p>Loading latest orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="py-20 text-center text-xs text-navy/60 bg-white rounded-3xl border border-sky-100 shadow-card">
                <ShoppingBag className="w-10 h-10 mx-auto mb-3 text-sky-300" />
                <p className="font-semibold text-navy text-sm mb-1">No orders placed yet</p>
                <p>When customers check out on SaveMart, orders will appear here immediately.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl p-6 border border-sky-100 shadow-card hover:shadow-soft transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-sky-50">
                        <span className="font-bold text-navy text-xs tracking-wider">
                          #{order.id}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
                          {order.status || 'processing'}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4 text-xs">
                        <div className="flex items-center gap-2 text-navy font-semibold">
                          <User className="w-3.5 h-3.5 text-navy/50" />
                          <span>{order.customerName || (order as any).customer_name || 'Customer'}</span>
                        </div>
                        <p className="text-navy/60 pl-5 text-[11px]">{order.email || (order as any).customer_email}</p>
                        {(order.address || (order as any).customer_address) && (
                          <p className="text-navy/70 pl-5 text-[11px] line-clamp-2">
                            📍 {order.address || (order as any).customer_address}{order.city ? `, ${order.city}` : ''}
                          </p>
                        )}
                        {order.phone && (
                          <p className="text-navy/60 pl-5 text-[11px]">
                            📞 {order.phone}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-navy/50 pl-5 text-[10px]">
                          <Calendar className="w-3 h-3" />
                          <span>{order.createdAt ? new Date(order.createdAt).toLocaleString('da-DK') : 'Recently'}</span>
                        </div>
                      </div>

                      <div className="bg-sky-50/50 rounded-2xl p-3 mb-4 space-y-2 max-h-44 overflow-y-auto">
                        <span className="text-[10px] font-bold text-navy uppercase tracking-wider block">
                          Ordered Items ({order.items?.length || 0}):
                        </span>
                        {(order.items || []).map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between text-xs text-navy/80 py-1 border-b border-sky-100/50 last:border-0"
                          >
                            <span className="truncate max-w-[180px]">
                              {item.quantity}x {item.name || (item as any).product?.name}
                            </span>
                            <span className="font-semibold shrink-0">
                              {((item.price ?? (item as any).product?.price ?? 0) * item.quantity).toFixed(2)} kr.
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-sky-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-navy/70">Total Paid:</span>
                      <span className="text-base font-black text-navy font-heading">
                        {Number(order.total).toFixed(2)} kr.
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Add Product Form */}
        {tab === 'products' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-sky-100 shadow-card">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-sky-100">
                <div className="w-10 h-10 rounded-2xl bg-sky-100 flex items-center justify-center text-navy shadow-inner">
                  <Boxes className="w-5 h-5 text-sky-800" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-navy font-heading">
                    Add Product to Catalog
                  </h2>
                  <p className="text-xs text-navy/60">
                    Create a new SKU with image, category, and pricing
                  </p>
                </div>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Shan Biryani Masala 50g"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-sky-100 text-xs text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                      Category
                    </label>
                    <select
                      value={newProduct.main_category}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, main_category: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-sky-100 text-xs text-navy focus:outline-none focus:ring-2 focus:ring-sky-400"
                    >
                      <option value="Herbs and Spices">Herbs and Spices</option>
                      <option value="Pulses and Beans">Pulses and Beans</option>
                      <option value="Rice and Flour">Rice and Flour</option>
                      <option value="Fresh Fruits & Vegetables">Fresh Fruits & Vegetables</option>
                      <option value="Oils & Ghee">Oils & Ghee</option>
                      <option value="Snacks & Sweets">Snacks & Sweets</option>
                      <option value="Beverages & Tea">Beverages & Tea</option>
                      <option value="Pickles & Chutneys">Pickles & Chutneys</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                      Unit / Package Size
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 500g, 1Kg, 240 bags"
                      value={newProduct.unit}
                      onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-sky-100 text-xs text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                      Selling Price (DKK) *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-sky-100 text-xs text-navy focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                      Regular / Strike Price (DKK)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={newProduct.regular_price}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          regular_price: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-sky-100 text-xs text-navy focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                      Primary Image URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={newProduct.primary_image}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, primary_image: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-sky-100 text-xs text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="High quality authentic spice directly sourced..."
                      value={newProduct.description}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, description: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-sky-100 text-xs text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setTab('orders')}
                    className="px-6 py-3 rounded-2xl bg-sky-50 text-navy text-xs font-semibold hover:bg-sky-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingProduct}
                    className="px-8 py-3 rounded-2xl bg-navy hover:bg-navy-light text-white text-xs font-bold tracking-wider uppercase transition shadow-md hover:shadow-lg disabled:opacity-70 flex items-center gap-2"
                  >
                    <PackageCheck className="w-4 h-4" />
                    <span>{addingProduct ? 'Adding...' : 'Save Product'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
