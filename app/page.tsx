'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CategoryTilesRow from '@/components/CategoryTilesRow';
import FreshPicksSection from '@/components/FreshPicksSection';
import PromoBanners from '@/components/PromoBanners';
import TrustInfoBar from '@/components/TrustInfoBar';
import NumberedRoutine from '@/components/NumberedRoutine';
import ProductList from '@/components/ProductList';
import CartDrawer from '@/components/CartDrawer';
import QuickViewModal from '@/components/QuickViewModal';
import Footer from '@/components/Footer';
import { Product, Category, CartItem } from '@/lib/types';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [routineProducts, setRoutineProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Cart & Wishlist
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load routine products & categories
  useEffect(() => {
    fetch('/api/products?routine=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.routine) setRoutineProducts(data.routine);
      })
      .catch(console.error);

    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
      })
      .catch(console.error);
  }, []);

  // Fetch catalog
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'All') {
      params.set('category', selectedCategory);
    }
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    if (inStockOnly) {
      params.set('inStock', 'true');
    }
    if (sortBy) {
      params.set('sort', sortBy);
    }
    params.set('page', currentPage.toString());
    params.set('limit', '24');

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          setProducts(data.products);
          setTotal(data.total);
          setTotalPages(data.totalPages);
        }
      })
      .catch(console.error);
  }, [selectedCategory, searchQuery, sortBy, inStockOnly, currentPage]);

  // Cart actions
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${quantity}x ${product.name} to cart!`);
  };

  const handleUpdateQuantity = (productId: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Wishlist toggle
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      if (prev.includes(product.id)) {
        showToast(`Removed from saved items`);
        return prev.filter((id) => id !== product.id);
      } else {
        showToast(`Saved ${product.name} to wishlist!`);
        return [...prev, product.id];
      }
    });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCategory = (catName: string) => {
    setSelectedCategory(catName);
    setCurrentPage(1);
    scrollToSection('catalog');
  };

  return (
    <div className="min-h-screen bg-[#F6FAFE] flex flex-col selection:bg-sky-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F2844] text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 animate-in slide-in-from-bottom duration-300">
          <span>🛒</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header (FreshKart style: Top logo/search/cart + Secondary category nav) */}
      <Navbar
        cartCount={cartItems.reduce((s, i) => s + i.quantity, 0)}
        wishlistCount={wishlistIds.length}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        onOpenCart={() => setIsCartOpen(true)}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        onScrollToSection={scrollToSection}
      />

      <main className="flex-1 space-y-2">
        {/* 2. Hero Section (FreshKart style with doodles, Groceries Made Easy, Tote bag) */}
        <Hero
          onExplore={() => scrollToSection('catalog')}
          onViewRoutine={() => scrollToSection('routine')}
          onSelectCategory={handleSelectCategory}
        />

        {/* 3. Category Tiles Row (6 Pastel Category Cards) */}
        <CategoryTilesRow onSelectCategory={handleSelectCategory} />

        {/* 4. Fresh Picks for You (5-Card Product Row) */}
        <FreshPicksSection
          products={products}
          onAddToCart={(p, q) => handleAddToCart(p, q || 1)}
          onQuickView={(p) => setQuickViewProduct(p)}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onViewAll={() => scrollToSection('catalog')}
        />

        {/* 5. Promo Banners Row (3 Wide Cards) */}
        <PromoBanners onSelectCategory={handleSelectCategory} />

        {/* 6. Trust & Info Bar (4 Columns) */}
        <TrustInfoBar />

        {/* 7. Cooking Routine (01-05) Section */}
        {routineProducts.length > 0 && (
          <NumberedRoutine
            routineProducts={routineProducts}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}

        {/* 8. Full Product Catalog (975 Scraped Products) */}
        <ProductList
          products={products}
          total={total}
          currentPage={currentPage}
          totalPages={totalPages}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          sortBy={sortBy}
          inStockOnly={inStockOnly}
          onPageChange={(page) => {
            setCurrentPage(page);
            scrollToSection('catalog');
          }}
          onCategoryChange={(cat) => {
            setSelectedCategory(cat);
            setCurrentPage(1);
          }}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setCurrentPage(1);
          }}
          onSortChange={(s) => {
            setSortBy(s);
            setCurrentPage(1);
          }}
          onInStockChange={(val) => {
            setInStockOnly(val);
            setCurrentPage(1);
          }}
          onAddToCart={(p) => handleAddToCart(p, 1)}
          onQuickView={(p) => setQuickViewProduct(p)}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
