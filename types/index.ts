export interface User {
  id: string;
  phone: string;
  name: string;
  email: string;
  avatar: string;
  addresses: Address[];
  preferredLanguage: 'ar' | 'fr';
  createdAt: Date;
}

export interface Product {
  id: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  sellerId: string;
  seller?: Seller;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  inventory: number;
  tags: string[];
  isFlashSale?: boolean;
  flashSaleEndsAt?: Date;
  isFavorite?: boolean;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  sellerId: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  lastUpdated: Date;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  subtotal: number;
  deliveryFee: number;
  status: OrderStatus;
  shippingAddress: Address;
  paymentMethod: PaymentMethodType;
  trackingId: string;
  estimatedDelivery: string;
  createdAt: Date;
  driver?: {
    name: string;
    phone: string;
    avatar: string;
    latitude: number;
    longitude: number;
  };
}

export interface OrderItem {
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  sellerId: string;
  status: OrderStatus;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export interface Seller {
  id: string;
  name: string;
  logo: string;
  rating: number;
  totalReviews: number;
  responseTime: string;
  joinDate: string;
  location: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  images: string[];
  createdAt: Date;
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  street: string;
  city: string;
  wilaya: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
}

export interface Wishlist {
  id: string;
  userId: string;
  productIds: string[];
  createdAt: Date;
}

export type PaymentMethodType = 'ccp' | 'edahabia' | 'cash_on_delivery' | 'wallet';

export interface PaymentMethod {
  id: string;
  userId: string;
  type: PaymentMethodType;
  label: string;
  cardNumber?: string;
  isDefault: boolean;
}

export interface Category {
  id: string;
  name: string;
  nameAr?: string;
  icon: string;
  image: string;
  color: string;
}

export interface FlashSale {
  id: string;
  title: string;
  endsAt: Date;
  products: Product[];
  bannerImage: string;
}

export type AppLanguage = 'fr' | 'ar';