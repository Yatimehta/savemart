import fs from 'fs';
import path from 'path';
import { Product, Category, Order } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// In-memory cache
let cachedProducts: Product[] | null = null;
let cachedCategories: Category[] | null = null;

function extractUnit(name: string): string {
  const match = name.match(/(\d+(?:\.\d+)?\s*(?:kg|g|gr|gm|ltr|l|ml|pcs|pieces|pack|bags))/i);
  return match ? match[0].trim() : 'Standard';
}

function loadProducts(): Product[] {
  if (cachedProducts) return cachedProducts;
  try {
    if (fs.existsSync(PRODUCTS_FILE)) {
      const raw = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
      const items = JSON.parse(raw);
      cachedProducts = items.map((item: any) => ({
        ...item,
        unit: extractUnit(item.name || ''),
        currency: item.currency || 'DKK',
        currency_symbol: item.currency_symbol || 'kr.',
        in_stock: item.in_stock !== false,
      }));
      return cachedProducts!;
    }
  } catch (err) {
    console.error('Error reading products.json:', err);
  }
  return [];
}

function loadCategories(): Category[] {
  if (cachedCategories) return cachedCategories;
  try {
    if (fs.existsSync(CATEGORIES_FILE)) {
      const raw = fs.readFileSync(CATEGORIES_FILE, 'utf-8');
      const items = JSON.parse(raw);
      // Filter top categories with count > 0
      cachedCategories = items
        .filter((c: any) => c.count > 0 && c.name && c.parent === 0)
        .sort((a: any, b: any) => b.count - a.count);
      return cachedCategories!;
    }
  } catch (err) {
    console.error('Error reading categories.json:', err);
  }
  return [];
}

export function getProducts(options?: {
  category?: string;
  search?: string;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'popular';
  page?: number;
  limit?: number;
}) {
  let list = [...loadProducts()];

  if (options?.category && options.category !== 'All' && options.category !== 'all') {
    const targetCat = options.category.toLowerCase();
    list = list.filter((p) => {
      const main = (p.main_category || '').toLowerCase();
      const inCats = (p.categories || []).some((c) => c.toLowerCase().includes(targetCat));
      return main.includes(targetCat) || inCats;
    });
  }

  if (options?.search) {
    const q = options.search.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.main_category && p.main_category.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }

  if (options?.inStock) {
    list = list.filter((p) => p.in_stock);
  }

  if (typeof options?.minPrice === 'number') {
    list = list.filter((p) => p.price >= options.minPrice!);
  }

  if (typeof options?.maxPrice === 'number') {
    list = list.filter((p) => p.price <= options.maxPrice!);
  }

  if (options?.sort) {
    switch (options.sort) {
      case 'price_asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'popular':
      default:
        // Prioritize in-stock with images
        list.sort((a, b) => (b.in_stock ? 1 : 0) - (a.in_stock ? 1 : 0));
        break;
    }
  }

  const total = list.length;
  const page = options?.page || 1;
  const limit = options?.limit || 24;
  const startIndex = (page - 1) * limit;
  const paginated = list.slice(startIndex, startIndex + limit);

  return {
    products: paginated,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export function getProductById(id: number | string): Product | null {
  const numId = typeof id === 'string' ? parseInt(id, 10) : id;
  const list = loadProducts();
  return list.find((p) => p.id === numId) || null;
}

export function getProductBySlug(slug: string): Product | null {
  const list = loadProducts();
  return list.find((p) => p.slug === slug) || null;
}

export function getCategories(): Category[] {
  return loadCategories();
}

// 01, 02, 03, 04, 05 Curated Routine Showcase (Faithful to BeautyBoo reference)
export function getCuratedRoutineProducts(): (Product & { stepNumber: string; stepLabel: string })[] {
  const list = loadProducts();

  // Find 5 representative staple products across categories
  const stepDefinitions = [
    { step: '01', label: 'SPICES & FLAVOR', keywords: ['masala', 'curry', 'cardamom', 'turmeric'] },
    { step: '02', label: 'STAPLES & PULSES', keywords: ['lentils', 'chick peas', 'daal', 'rice'] },
    { step: '03', label: 'COOKING OIL & GHEE', keywords: ['mustard oil', 'almond oil', 'ghee', 'olive oil'] },
    { step: '04', label: 'DAILY INFUSIONS', keywords: ['tea', 'green tea', 'coffee'] },
    { step: '05', label: 'SWEETS & DESSERT', keywords: ['burfi', 'sweet', 'rusk', 'wafer'] },
  ];

  return stepDefinitions.map((def) => {
    let found = list.find((p) =>
      p.in_stock &&
      p.price > 0 &&
      def.keywords.some((k) => p.name.toLowerCase().includes(k))
    );
    if (!found) {
      found = list[Math.floor(Math.random() * list.length)];
    }
    return {
      ...found,
      stepNumber: def.step,
      stepLabel: def.label,
    };
  });
}

// Orders management
export function getOrders(): Order[] {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading orders:', err);
  }
  return [];
}

export function createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Order {
  const orders = getOrders();
  const newOrder: Order = {
    ...orderData,
    id: 'SM-' + Date.now().toString().slice(-6),
    status: 'processing',
    createdAt: new Date().toISOString(),
  };
  orders.unshift(newOrder);
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving order:', err);
  }
  return newOrder;
}

export function updateProduct(id: number, updates: Partial<Product>): Product | null {
  const list = loadProducts();
  const idx = list.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...updates };
  cachedProducts = list;
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error persisting product update:', err);
  }
  return list[idx];
}

export function addProduct(newProductData: Omit<Product, 'id'>): Product {
  const list = loadProducts();
  const maxId = list.reduce((max, p) => Math.max(max, p.id || 0), 10000);
  const newProduct: Product = {
    ...newProductData,
    id: maxId + 1,
    slug: newProductData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    currency: 'DKK',
    currency_symbol: 'kr.',
    unit: extractUnit(newProductData.name),
  };
  list.unshift(newProduct);
  cachedProducts = list;
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving new product:', err);
  }
  return newProduct;
}
