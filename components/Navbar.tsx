'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Leaf, 
  Home, 
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenCart: () => void;
  onOpenSearch?: () => void;
  selectedCategory: string;
  onSelectCategory: (catName: string) => void;
  onScrollToSection: (id: string) => void;
}

export default function Navbar({
  cartCount,
  searchQuery,
  onSearchChange,
  onOpenCart,
  selectedCategory,
  onSelectCategory,
  onScrollToSection,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
    onScrollToSection('catalog');
  };

  const navLinks = [
    { label: 'Home', id: 'hero', category: 'All' },
    { label: 'Fruits & Vegetables', id: 'catalog', category: 'Vegetables' },
    { label: 'Dairy & Eggs', id: 'catalog', category: 'Oil & Ghee' },
    { label: 'Pantry & Spices', id: 'catalog', category: 'Herbs and Spices' },
    { label: 'Snacks & Beverages', id: 'catalog', category: 'Snack & savories' },
    { label: 'Cooking Routine', id: 'routine', category: '' },
    { label: 'Personal Care', id: 'catalog', category: 'Beauty & Health' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-sky-100 shadow-2xs transition-all">
      {/* Top Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 lg:gap-8">
        
        {/* Logo (FreshKart Reference: Double Leaf + Friendly Bold Text + Tagline) */}
        <div 
          onClick={() => {
            onSelectCategory('All');
            onScrollToSection('hero');
          }}
          className="cursor-pointer flex items-center gap-2 group shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-[#EAF5FE] text-leaf flex items-center justify-center group-hover:scale-105 transition-transform">
            <div className="relative">
              <Leaf className="w-5 h-5 text-[#228B22] fill-[#228B22]" />
              <Leaf className="w-3.5 h-3.5 text-[#3CB371] fill-[#3CB371] absolute -top-1 -right-1" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-heading font-black text-2xl tracking-tight text-[#0F2844] group-hover:text-sky-700 transition leading-none">
                SaveMart
              </span>
              <span className="text-[10px] uppercase font-bold text-leaf bg-leaf-light px-1.5 py-0.2 rounded">
                DK
              </span>
            </div>
            <span className="text-[10px] font-medium text-navy/60 font-doodle block -mt-0.5 tracking-wide">
              Good Food. Happy You.
            </span>
          </div>
        </div>

        {/* Wide Center Search Bar (Reference Layout) */}
        <div className="flex-1 max-w-2xl mx-auto hidden sm:block">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/40" />
            <input
              type="text"
              placeholder="Search for fruits, vegetables, dairy, household items..."
              value={searchQuery}
              onChange={handleSearchInput}
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#F3F8FD] border border-sky-200/80 text-xs sm:text-sm text-navy placeholder:text-navy/45 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:bg-white transition shadow-inner"
            />
          </div>
        </div>

        {/* Right Action Icons: Login / Sign Up + Cart */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          <Link
            href="/admin"
            className="hidden md:flex items-center gap-1.5 text-xs font-bold text-navy/80 hover:text-navy transition py-1"
          >
            <User className="w-4 h-4 text-sky-700" />
            <span>Login / Sign Up</span>
          </Link>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-full hover:bg-sky-50 text-navy font-bold text-xs transition relative"
            aria-label="Shopping Cart"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-sky-800" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-[#0F2844] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline text-xs font-extrabold text-[#0F2844]">Cart</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-navy hover:bg-sky-50 transition"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Row */}
      <div className="sm:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/40" />
          <input
            type="text"
            placeholder="Search for fruits, spices, daal..."
            value={searchQuery}
            onChange={handleSearchInput}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-[#F3F8FD] border border-sky-200 text-xs text-navy placeholder:text-navy/45 focus:outline-none focus:bg-white"
          />
        </div>
      </div>

      {/* Secondary Category Navigation Bar (Reference Layout) */}
      <div className="border-t border-sky-100/70 bg-[#FAFCFF] hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6">
          {/* All Categories Button */}
          <button
            onClick={() => {
              onSelectCategory('All');
              onScrollToSection('catalog');
            }}
            className="flex items-center gap-2 px-4 py-2.5 my-1.5 rounded-xl bg-[#EAF4FD] hover:bg-sky-100 text-[#0F2844] text-xs font-black transition shrink-0"
          >
            <Menu className="w-4 h-4 text-sky-700" />
            <span>All Categories</span>
          </button>

          {/* Horizontal Category Nav Links */}
          <nav className="flex items-center gap-7 text-xs font-bold text-navy/80">
            {navLinks.map((link) => {
              const isHome = link.label === 'Home';
              const isSelected =
                (isHome && (selectedCategory === 'All' || !selectedCategory)) ||
                (!isHome && link.category && (selectedCategory || '').toLowerCase() === link.category.toLowerCase());

              return (
                <button
                  key={link.label}
                  onClick={() => {
                    if (link.category) onSelectCategory(link.category);
                    onScrollToSection(link.id);
                  }}
                  className={`py-3 transition relative flex items-center gap-1.5 ${
                    isSelected
                      ? 'text-[#0F2844] font-black after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#0F2844]'
                      : 'hover:text-[#0F2844]'
                  }`}
                >
                  {isHome && <Home className="w-3.5 h-3.5 text-sky-700" />}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-sky-100 px-6 py-5 space-y-3 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-1 text-sm font-bold text-navy">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  if (link.category) onSelectCategory(link.category);
                  onScrollToSection(link.id);
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 px-3 rounded-xl hover:bg-sky-50 transition"
              >
                {link.label}
              </button>
            ))}
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left py-2 px-3 rounded-xl hover:bg-sky-50 text-sky-700 transition"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
