'use client';

import React from 'react';
import { Search, ShoppingBag, Heart, Menu, X, Sparkles, ShieldCheck, ChefHat } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenAdmin: () => void;
  onScrollToSection: (id: string) => void;
}

export default function Navbar({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenSearch,
  onOpenAdmin,
  onScrollToSection,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-sky-100 transition-all">
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-sky-200 via-sky-100 to-sky-200 py-2 px-4 text-center text-xs sm:text-sm font-medium text-navy flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-sky-600 animate-spin" style={{ animationDuration: '8s' }} />
        <span>Free Delivery in Denmark on orders above 250 kr. | Fresh Stock Arrived This Morning</span>
        <span className="hidden md:inline text-sky-400">•</span>
        <span className="hidden md:inline-flex items-center gap-1 text-navy-muted">
          <ShieldCheck className="w-3.5 h-3.5 text-leaf" /> 100% Halal & Authentic Quality
        </span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => onScrollToSection('hero')}
          className="cursor-pointer flex items-center gap-2 group"
        >
          <div className="relative">
            <span className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-wider text-navy group-hover:text-sky-700 transition">
              SAVEMART
            </span>
            <span className="absolute -top-1.5 left-[4.8rem] sm:left-[6.1rem] text-amber-400 text-xs sm:text-sm animate-pulse">
              ✿
            </span>
          </div>
          <span className="text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-semibold hidden sm:inline-block">
            DENMARK
          </span>
        </div>

        {/* Center Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-navy/80">
          <button 
            onClick={() => onScrollToSection('hero')}
            className="hover:text-navy transition relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-navy hover:after:w-full after:transition-all"
          >
            Home
          </button>
          <button 
            onClick={() => onScrollToSection('routine')}
            className="hover:text-navy transition relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-navy hover:after:w-full after:transition-all"
          >
            Cooking Routine (01–05)
          </button>
          <button 
            onClick={() => onScrollToSection('categories')}
            className="hover:text-navy transition relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-navy hover:after:w-full after:transition-all"
          >
            Aisles & Categories
          </button>
          <button 
            onClick={() => onScrollToSection('recipes')}
            className="hover:text-navy transition relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-navy hover:after:w-full after:transition-all flex items-center gap-1"
          >
            <ChefHat className="w-3.5 h-3.5 text-sky-700" />
            <span>Recipe Bundles</span>
          </button>
          <button 
            onClick={() => onScrollToSection('catalog')}
            className="hover:text-navy transition relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-navy hover:after:w-full after:transition-all"
          >
            All Groceries (975)
          </button>
          <button 
            onClick={onOpenAdmin}
            className="text-xs text-navy/60 hover:text-navy transition"
          >
            Admin
          </button>
        </nav>

        {/* Right Action Icons & Pill CTA */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-2.5 rounded-full hover:bg-sky-50 text-navy/80 hover:text-navy transition"
            aria-label="Search groceries"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist Icon */}
          <button
            onClick={() => alert(`You have ${wishlistCount} item(s) in your saved wishlist.`)}
            className="p-2.5 rounded-full hover:bg-sky-50 text-navy/80 hover:text-navy transition relative"
            aria-label="Saved items"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-coral text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Drawer Trigger */}
          <button
            onClick={onOpenCart}
            className="p-2.5 rounded-full hover:bg-sky-50 text-navy/80 hover:text-navy transition relative"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-navy text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Pill CTA Button */}
          <button
            onClick={() => onScrollToSection('catalog')}
            className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-navy hover:bg-navy-light text-white text-xs font-semibold tracking-wide shadow-sm hover:shadow-md transition active:scale-95"
          >
            Shop Fresh
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-navy hover:bg-sky-50 transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-sky-100 px-6 py-6 space-y-4 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-3 font-medium text-navy/90">
            <button
              onClick={() => { onScrollToSection('hero'); setMobileMenuOpen(false); }}
              className="text-left py-2 border-b border-sky-50"
            >
              Home
            </button>
            <button
              onClick={() => { onScrollToSection('routine'); setMobileMenuOpen(false); }}
              className="text-left py-2 border-b border-sky-50"
            >
              Cooking Routine (01–05)
            </button>
            <button
              onClick={() => { onScrollToSection('categories'); setMobileMenuOpen(false); }}
              className="text-left py-2 border-b border-sky-50"
            >
              Aisles & Categories
            </button>
            <button
              onClick={() => { onScrollToSection('recipes'); setMobileMenuOpen(false); }}
              className="text-left py-2 border-b border-sky-50 text-sky-800 font-semibold flex items-center gap-1.5"
            >
              <ChefHat className="w-4 h-4 text-sky-700" />
              <span>Recipe Bundles (1-Click)</span>
            </button>
            <button
              onClick={() => { onScrollToSection('catalog'); setMobileMenuOpen(false); }}
              className="text-left py-2 border-b border-sky-50"
            >
              All Groceries (975)
            </button>
            <button
              onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
              className="text-left py-2 text-xs text-navy/60"
            >
              Admin Dashboard
            </button>
          </div>
          <button
            onClick={() => { onScrollToSection('catalog'); setMobileMenuOpen(false); }}
            className="w-full py-3 rounded-full bg-navy text-white text-sm font-semibold tracking-wide"
          >
            Start Shopping
          </button>
        </div>
      )}
    </header>
  );
}
