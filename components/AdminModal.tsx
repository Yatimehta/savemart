'use client';

import React, { useState, useEffect } from 'react';
import { Product, Order } from '@/lib/types';
import { X, Plus, PackageCheck, ShoppingBag, DollarSign } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: (newProd: Product) => void;
}

export default function AdminModal({
  isOpen,
  onClose,
  onProductAdded,
}: AdminModalProps) {
  const [tab, setTab] = useState<'products' | 'orders'>('products');
  const [orders, setOrders] = useState<Order[]>([]);
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

  useEffect(() => {
    if (isOpen) {
      fetch('/api/orders')
        .then((res) => res.json())
        .then((data) => {
          if (data.orders) setOrders(data.orders);
        })
        .catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
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
        onProductAdded(data);
        alert('Product added successfully!');
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
      }
    } catch (err) {
      console.error(err);
      alert('Failed to add product.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-navy/40 backdrop-blur-xs" />

      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-sky-100 z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-sky-100 mb-6">
          <div className="flex items-center gap-2">
            <h2 className="font-serif-luxury text-xl font-bold text-navy">
              SaveMart Management Dashboard
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-sky-50 text-navy/60 hover:text-navy"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setTab('products')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition ${
              tab === 'products' ? 'bg-navy text-white' : 'bg-sky-50 text-navy/70 hover:bg-sky-100'
            }`}
          >
            Add New Product
          </button>
          <button
            onClick={() => setTab('orders')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${
              tab === 'orders' ? 'bg-navy text-white' : 'bg-sky-50 text-navy/70 hover:bg-sky-100'
            }`}
          >
            <span>Customer Orders</span>
            <span className="px-1.5 py-0.2 rounded-full bg-sky-200 text-sky-800 text-[10px]">
              {orders.length}
            </span>
          </button>
        </div>

        {tab === 'products' ? (
          <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-navy">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kashmiri Saffron 5g"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-sky-200 focus:ring-2 focus:ring-sky-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-navy">Category</label>
                <select
                  value={newProduct.main_category}
                  onChange={(e) => setNewProduct({ ...newProduct, main_category: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-sky-200 bg-white focus:ring-2 focus:ring-sky-300"
                >
                  <option>Herbs and Spices</option>
                  <option>Ready Masala</option>
                  <option>Bean, Peas, Lentils and Daal</option>
                  <option>Vegetables</option>
                  <option>Tea & Coffe</option>
                  <option>Oil & Ghee</option>
                  <option>Snack & savories</option>
                  <option>Beauty & Health</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-navy">Price (kr.)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2.5 rounded-xl border border-sky-200 focus:ring-2 focus:ring-sky-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-navy">Unit / Weight</label>
                <input
                  type="text"
                  placeholder="e.g. 500g, 1 Kg"
                  value={newProduct.unit}
                  onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-sky-200 focus:ring-2 focus:ring-sky-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-navy">Stock Status</label>
                <select
                  value={newProduct.in_stock ? 'yes' : 'no'}
                  onChange={(e) => setNewProduct({ ...newProduct, in_stock: e.target.value === 'yes' })}
                  className="w-full p-2.5 rounded-xl border border-sky-200 bg-white focus:ring-2 focus:ring-sky-300"
                >
                  <option value="yes">In Stock</option>
                  <option value="no">Out of Stock</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-navy">Image URL</label>
              <input
                type="url"
                value={newProduct.primary_image}
                onChange={(e) => setNewProduct({ ...newProduct, primary_image: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-sky-200 focus:ring-2 focus:ring-sky-300"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-navy">Description</label>
              <textarea
                rows={2}
                placeholder="Product description..."
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-sky-200 focus:ring-2 focus:ring-sky-300"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-navy text-white font-bold tracking-wide hover:bg-navy-light transition shadow-md"
            >
              Add Product to Live Database
            </button>
          </form>
        ) : (
          <div className="max-h-96 overflow-y-auto space-y-3">
            {orders.length > 0 ? (
              orders.map((ord) => (
                <div key={ord.id} className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold text-navy">
                    <span>Order #{ord.id}</span>
                    <span className="text-leaf">{ord.total.toFixed(2)} kr.</span>
                  </div>
                  <div className="text-navy/70">
                    <div><strong>Customer:</strong> {ord.customerName} ({ord.phone})</div>
                    <div><strong>Address:</strong> {ord.address}, {ord.city}</div>
                    <div><strong>Slot:</strong> {ord.deliverySlot}</div>
                    <div><strong>Items ({ord.items.length}):</strong> {ord.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}</div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-navy/50 text-xs">No orders placed yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
