export interface Product {
  id: number;
  name: string;
  slug: string;
  permalink?: string;
  sku?: string;
  price: number;
  regular_price: number;
  sale_price?: number | null;
  on_sale?: boolean;
  currency: string;
  currency_symbol: string;
  in_stock: boolean;
  is_purchasable?: boolean;
  description: string;
  short_description?: string;
  primary_image?: string | null;
  images?: string[];
  main_category: string;
  categories: string[];
  unit?: string;
  average_rating?: number;
  review_count?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
  image?: string | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  deliverySlot: string;
  items: {
    productId: number;
    name: string;
    price: number;
    quantity: number;
    image?: string | null;
  }[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  status: 'pending' | 'processing' | 'delivered';
  createdAt: string;
}
