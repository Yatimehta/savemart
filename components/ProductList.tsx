'use client';

import React from 'react';
import { Product } from '@/lib/types';
import ProductCard from './ProductCard';
import { Search, SlidersHorizontal, ArrowUpDown, RefreshCcw } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  total: number;
  currentPage: number;
  totalPages: number;
  selectedCategory: string;
  searchQuery: string;
  sortBy: string;
  inStockOnly: boolean;
  onPageChange: (page: number) => void;
  onCategoryChange: (cat: string) => void;
  onSearchChange: (q: string) => void;
  onSortChange: (sort: string) => void;
  onInStockChange: (val: boolean) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  wishlistIds: number[];
  onToggleWishlist: (product: Product) => void;
}

export default function ProductList({
  products,
  total,
  currentPage,
  totalPages,
  selectedCategory,
  searchQuery,
  sortBy,
  inStockOnly,
  onPageChange,
  onCategoryChange,
  onSearchChange,
  onSortChange,
  onInStockChange,
  onAddToCart,
  onQuickView,
  wishlistIds,
  onToggleWishlist,
}: ProductListProps) {
  return (
    <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header & Controls */}
      <div className="space-y-6 mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-sky-800 uppercase block mb-1">
              FULL CATALOG
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-navy">
              Explore Our Pantry
            </h2>
          </div>
          <div className="text-xs sm:text-sm text-navy/70 font-medium">
            Showing <span className="font-bold text-navy">{products.length}</span> of <span className="font-bold text-navy">{total}</span> items in stock
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-sky-100 shadow-card flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/40" />
            <input
              type="text"
              placeholder="Search spices, rice, tea, snacks, oils..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-sky-50/50 border border-sky-100 text-sm text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:bg-white transition"
            />
          </div>

          {/* Right Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
            {/* In-Stock Toggle */}
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-navy/80 bg-sky-50 px-3.5 py-2.5 rounded-2xl border border-sky-100">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => onInStockChange(e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-400"
              />
              <span>In Stock Only</span>
            </label>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-sky-50 px-3 py-1.5 rounded-2xl border border-sky-100">
              <ArrowUpDown className="w-3.5 h-3.5 text-navy/50" />
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="bg-transparent text-xs font-semibold text-navy focus:outline-none cursor-pointer py-1"
              >
                <option value="popular">Most Popular</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
              </select>
            </div>

            {/* Reset Filters */}
            {(searchQuery || selectedCategory !== 'All' || inStockOnly) && (
              <button
                onClick={() => {
                  onSearchChange('');
                  onCategoryChange('All');
                  onInStockChange(false);
                }}
                className="p-2.5 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-semibold flex items-center gap-1 transition"
                title="Reset Filters"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-sky-100 p-8 space-y-4 shadow-card">
          <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto text-2xl">
            🔍
          </div>
          <h3 className="text-lg font-bold text-navy">No groceries found</h3>
          <p className="text-xs sm:text-sm text-navy/60 max-w-sm mx-auto">
            We couldn't find any products matching your filters. Try clearing your search or browsing another category.
          </p>
          <button
            onClick={() => {
              onSearchChange('');
              onCategoryChange('All');
              onInStockChange(false);
            }}
            className="px-6 py-2.5 rounded-full bg-navy text-white text-xs font-semibold"
          >
            Show All Products
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-2xl bg-white border border-sky-100 text-xs font-semibold text-navy disabled:opacity-40 disabled:cursor-not-allowed hover:bg-sky-50 transition shadow-xs"
          >
            Previous
          </button>

          <span className="text-xs font-semibold text-navy/70 px-3">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-2xl bg-white border border-sky-100 text-xs font-semibold text-navy disabled:opacity-40 disabled:cursor-not-allowed hover:bg-sky-50 transition shadow-xs"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
