import { create } from 'zustand';
import {
  Product,
  CartItem,
  Order,
  OrderStatus,
  Category,
  PaymentMethodType,
  Seller,
  Review,
} from '@/types';

// ============== MOCK DATA ==============

const mockSellers: Seller[] = [
  {
    id: 's1',
    name: 'TechZone DZ',
    logo: 'https://ui-avatars.com/api/?name=TechZone+DZ&background=f97316&color=fff&size=200',
    rating: 4.8,
    totalReviews: 1243,
    responseTime: '< 1h',
    joinDate: '2021',
    location: 'Alger',
  },
  {
    id: 's2',
    name: 'Mode Algérie',
    logo: 'https://ui-avatars.com/api/?name=Mode+Algerie&background=ec4899&color=fff&size=200',
    rating: 4.6,
    totalReviews: 876,
    responseTime: '< 2h',
    joinDate: '2022',
    location: 'Oran',
  },
  {
    id: 's3',
    name: 'Maison & Déco',
    logo: 'https://ui-avatars.com/api/?name=Maison+Deco&background=10b981&color=fff&size=200',
    rating: 4.7,
    totalReviews: 542,
    responseTime: '< 30min',
    joinDate: '2020',
    location: 'Constantine',
  },
];

const mockReviews: Review[] = [
  {
    id: 'r1',
    productId: 'p1',
    userId: 'u2',
    userName: 'Amina K.',
    userAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
    comment: 'Excellente qualité sonore ! Livraison rapide à Alger. Je recommande vivement.',
    images: [],
    createdAt: new Date('2024-12-15'),
  },
  {
    id: 'r2',
    productId: 'p1',
    userId: 'u3',
    userName: 'Youcef M.',
    userAvatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    rating: 4,
    comment: 'Très bon produit, le son est clair. Le seul bémol est le câble un peu court.',
    images: [],
    createdAt: new Date('2024-12-10'),
  },
  {
    id: 'r3',
    productId: 'p2',
    userId: 'u4',
    userName: 'Fatima Z.',
    userAvatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    rating: 5,
    comment: 'Montre magnifique ! Le design est élégant et la batterie tient bien.',
    images: [],
    createdAt: new Date('2024-12-20'),
  },
];

const mockProducts: Product[] = [
  {
    id: 'p1',
    title: 'Casque Audio Premium',
    titleAr: 'سماعات رأس ممتازة',
    description:
      'Casque audio sans fil avec réduction de bruit active, autonomie 30h, Bluetooth 5.3. Son Hi-Fi avec basses profondes.',
    descriptionAr: 'سماعات رأس لاسلكية مع إلغاء الضوضاء النشط، بطارية 30 ساعة، بلوتوث 5.3.',
    price: 8500,
    originalPrice: 12000,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
    ],
    category: 'electronics',
    sellerId: 's1',
    seller: mockSellers[0],
    rating: 4.7,
    reviewCount: 234,
    reviews: [mockReviews[0], mockReviews[1]],
    inventory: 45,
    tags: ['audio', 'bluetooth', 'sans fil'],
    isFlashSale: true,
    flashSaleEndsAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
    isFavorite: false,
  },
  {
    id: 'p2',
    title: 'Montre Classique Élégante',
    titleAr: 'ساعة كلاسيكية أنيقة',
    description:
      'Montre en acier inoxydable avec bracelet en cuir véritable. Mouvement quartz japonais, étanche 50m.',
    descriptionAr: 'ساعة من الفولاذ المقاوم للصدأ مع سوار جلد حقيقي. حركة كوارتز يابانية.',
    price: 15900,
    originalPrice: 19500,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800',
    ],
    category: 'fashion',
    sellerId: 's2',
    seller: mockSellers[1],
    rating: 4.9,
    reviewCount: 156,
    reviews: [mockReviews[2]],
    inventory: 12,
    tags: ['montre', 'luxe', 'accessoire'],
    isFavorite: true,
  },
  {
    id: 'p3',
    title: 'Sneakers Running Pro',
    titleAr: 'حذاء رياضي للجري',
    description:
      'Chaussures de running ultra-légères avec semelle en mousse réactive. Respirantes et confortables pour la course.',
    descriptionAr: 'حذاء جري خفيف الوزن مع نعل من الرغوة التفاعلية. قابل للتنفس ومريح.',
    price: 6200,
    originalPrice: 8900,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800',
    ],
    category: 'fashion',
    sellerId: 's2',
    seller: mockSellers[1],
    rating: 4.5,
    reviewCount: 389,
    reviews: [],
    inventory: 78,
    tags: ['sport', 'running', 'chaussures'],
    isFlashSale: true,
    flashSaleEndsAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
    isFavorite: false,
  },
  {
    id: 'p4',
    title: 'Bouteille Thermos Design',
    titleAr: 'قارورة حرارية أنيقة',
    description:
      'Bouteille isotherme en acier inoxydable 500ml. Garde chaud 12h, froid 24h. Anti-fuite, design moderne.',
    descriptionAr: 'قارورة معزولة من الفولاذ المقاوم للصدأ 500 مل. تحافظ على الحرارة 12 ساعة.',
    price: 2800,
    images: [
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800',
    ],
    category: 'home',
    sellerId: 's3',
    seller: mockSellers[2],
    rating: 4.3,
    reviewCount: 67,
    reviews: [],
    inventory: 200,
    tags: ['cuisine', 'thermos', 'design'],
    isFavorite: false,
  },
  {
    id: 'p5',
    title: 'Smartphone Galaxy Ultra',
    titleAr: 'هاتف ذكي جالاكسي ألترا',
    description:
      'Écran AMOLED 6.8", 256GB, caméra 200MP, batterie 5000mAh. Le meilleur de la technologie mobile.',
    descriptionAr: 'شاشة أموليد 6.8 بوصة، 256 جيجابايت، كاميرا 200 ميجابكسل.',
    price: 145000,
    originalPrice: 165000,
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
      'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=800',
    ],
    category: 'electronics',
    sellerId: 's1',
    seller: mockSellers[0],
    rating: 4.8,
    reviewCount: 521,
    reviews: [],
    inventory: 8,
    tags: ['smartphone', 'samsung', 'mobile'],
    isFavorite: false,
  },
  {
    id: 'p6',
    title: 'Lampe de Bureau LED',
    titleAr: 'مصباح مكتبي LED',
    description:
      'Lampe de bureau LED avec 5 niveaux de luminosité et 3 modes d\'éclairage. Bras flexible, port USB intégré.',
    descriptionAr: 'مصباح مكتبي LED مع 5 مستويات سطوع و3 أوضاع إضاءة.',
    price: 3500,
    originalPrice: 4200,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=800',
    ],
    category: 'home',
    sellerId: 's3',
    seller: mockSellers[2],
    rating: 4.4,
    reviewCount: 98,
    reviews: [],
    inventory: 55,
    tags: ['lampe', 'bureau', 'led'],
    isFavorite: false,
  },
  {
    id: 'p7',
    title: 'Sac à Dos Urbain',
    titleAr: 'حقيبة ظهر حضرية',
    description:
      'Sac à dos imperméable avec compartiment laptop 15.6", port USB de charge externe. Tissu anti-vol.',
    descriptionAr: 'حقيبة ظهر مقاومة للماء مع حجرة لابتوب 15.6 بوصة.',
    price: 4500,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
    ],
    category: 'fashion',
    sellerId: 's2',
    seller: mockSellers[1],
    rating: 4.6,
    reviewCount: 203,
    reviews: [],
    inventory: 34,
    tags: ['sac', 'urbain', 'laptop'],
    isFavorite: true,
  },
  {
    id: 'p8',
    title: 'Écouteurs Bluetooth Sport',
    titleAr: 'سماعات بلوتوث رياضية',
    description:
      'Écouteurs Bluetooth 5.0 résistants à l\'eau IPX7. Autonomie 8h, crochets d\'oreille sécurisés.',
    descriptionAr: 'سماعات بلوتوث 5.0 مقاومة للماء IPX7. بطارية 8 ساعات.',
    price: 3200,
    originalPrice: 4800,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=800',
    ],
    category: 'electronics',
    sellerId: 's1',
    seller: mockSellers[0],
    rating: 4.2,
    reviewCount: 176,
    reviews: [],
    inventory: 120,
    tags: ['écouteurs', 'bluetooth', 'sport'],
    isFlashSale: true,
    flashSaleEndsAt: new Date(Date.now() + 6 * 60 * 60 * 1000),
    isFavorite: false,
  },
];

const mockCategories: Category[] = [
  {
    id: 'electronics',
    name: 'Électronique',
    nameAr: 'إلكترونيات',
    icon: 'phone-portrait-outline',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    color: '#f97316',
  },
  {
    id: 'fashion',
    name: 'Mode',
    nameAr: 'أزياء',
    icon: 'shirt-outline',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    color: '#ec4899',
  },
  {
    id: 'home',
    name: 'Maison',
    nameAr: 'منزل',
    icon: 'home-outline',
    image: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=400',
    color: '#10b981',
  },
  {
    id: 'beauty',
    name: 'Beauté',
    nameAr: 'جمال',
    icon: 'sparkles-outline',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400',
    color: '#8b5cf6',
  },
  {
    id: 'sports',
    name: 'Sport',
    nameAr: 'رياضة',
    icon: 'fitness-outline',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
    color: '#3b82f6',
  },
  {
    id: 'food',
    name: 'Alimentation',
    nameAr: 'غذاء',
    icon: 'restaurant-outline',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    color: '#ef4444',
  },
];

const mockOrders: Order[] = [
  {
    id: 'ord-001',
    userId: 'u1',
    items: [
      {
        productId: 'p1',
        product: mockProducts[0],
        quantity: 1,
        price: 8500,
        sellerId: 's1',
        status: 'out_for_delivery',
      },
      {
        productId: 'p4',
        product: mockProducts[3],
        quantity: 2,
        price: 2800,
        sellerId: 's3',
        status: 'out_for_delivery',
      },
    ],
    totalPrice: 14500,
    subtotal: 14100,
    deliveryFee: 400,
    status: 'out_for_delivery',
    shippingAddress: {
      id: 'a1',
      userId: 'u1',
      label: 'Maison',
      street: '12 Rue Didouche Mourad',
      city: 'Alger Centre',
      wilaya: 'Alger',
      postalCode: '16000',
      phone: '+213 555 123 456',
      isDefault: true,
      latitude: 36.7538,
      longitude: 3.0588,
    },
    paymentMethod: 'cash_on_delivery',
    trackingId: 'TRK-2024-001',
    estimatedDelivery: 'Aujourd\'hui, 14:00 - 16:00',
    createdAt: new Date('2024-12-28'),
    driver: {
      name: 'Ahmed Benali',
      phone: '+213 555 999 888',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      latitude: 36.76,
      longitude: 3.065,
    },
  },
  {
    id: 'ord-002',
    userId: 'u1',
    items: [
      {
        productId: 'p3',
        product: mockProducts[2],
        quantity: 1,
        price: 6200,
        sellerId: 's2',
        status: 'delivered',
      },
    ],
    totalPrice: 6600,
    subtotal: 6200,
    deliveryFee: 400,
    status: 'delivered',
    shippingAddress: {
      id: 'a1',
      userId: 'u1',
      label: 'Maison',
      street: '12 Rue Didouche Mourad',
      city: 'Alger Centre',
      wilaya: 'Alger',
      postalCode: '16000',
      phone: '+213 555 123 456',
      isDefault: true,
    },
    paymentMethod: 'edahabia',
    trackingId: 'TRK-2024-002',
    estimatedDelivery: 'Livré le 25 Déc',
    createdAt: new Date('2024-12-23'),
  },
  {
    id: 'ord-003',
    userId: 'u1',
    items: [
      {
        productId: 'p5',
        product: mockProducts[4],
        quantity: 1,
        price: 145000,
        sellerId: 's1',
        status: 'processing',
      },
    ],
    totalPrice: 145400,
    subtotal: 145000,
    deliveryFee: 400,
    status: 'processing',
    shippingAddress: {
      id: 'a2',
      userId: 'u1',
      label: 'Bureau',
      street: '45 Boulevard Mohamed V',
      city: 'Bab Ezzouar',
      wilaya: 'Alger',
      postalCode: '16031',
      phone: '+213 555 789 012',
      isDefault: false,
    },
    paymentMethod: 'ccp',
    trackingId: 'TRK-2024-003',
    estimatedDelivery: '30 Déc - 2 Jan',
    createdAt: new Date('2024-12-27'),
  },
];

// ============== STORE ==============

interface StoreState {
  // Products
  products: Product[];
  categories: Category[];
  flashSaleProducts: Product[];
  selectedCategory: string | null;
  searchQuery: string;
  searchHistory: string[];

  // Cart
  cartItems: CartItem[];
  cartTotal: number;

  // Orders
  orders: Order[];

  // Wishlist
  wishlistIds: string[];

  // UI
  isLoading: boolean;

  // Actions
  setSelectedCategory: (categoryId: string | null) => void;
  setSearchQuery: (query: string) => void;
  addToSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;

  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  placeOrder: (paymentMethod: PaymentMethodType) => Order;
  getProductById: (id: string) => Product | undefined;
  getOrderById: (id: string) => Order | undefined;
  getFilteredProducts: () => Product[];
}

export const useStore = create<StoreState>((set, get) => ({
  products: mockProducts,
  categories: mockCategories,
  flashSaleProducts: mockProducts.filter((p) => p.isFlashSale),
  selectedCategory: null,
  searchQuery: '',
  searchHistory: ['casque bluetooth', 'sneakers', 'smartphone samsung'],

  cartItems: [],
  cartTotal: 0,

  orders: mockOrders,

  wishlistIds: ['p2', 'p7'],

  isLoading: false,

  setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  addToSearchHistory: (query) =>
    set((state) => ({
      searchHistory: [query, ...state.searchHistory.filter((q) => q !== query)].slice(0, 10),
    })),

  clearSearchHistory: () => set({ searchHistory: [] }),

  addToCart: (product, quantity = 1) =>
    set((state) => {
      const existing = state.cartItems.find((item) => item.productId === product.id);
      let newItems: CartItem[];
      if (existing) {
        newItems = state.cartItems.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [
          ...state.cartItems,
          {
            productId: product.id,
            product,
            quantity,
            price: product.price,
            sellerId: product.sellerId,
          },
        ];
      }
      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return { cartItems: newItems, cartTotal: total };
    }),

  removeFromCart: (productId) =>
    set((state) => {
      const newItems = state.cartItems.filter((item) => item.productId !== productId);
      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return { cartItems: newItems, cartTotal: total };
    }),

  updateCartQuantity: (productId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        const newItems = state.cartItems.filter((item) => item.productId !== productId);
        const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return { cartItems: newItems, cartTotal: total };
      }
      const newItems = state.cartItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return { cartItems: newItems, cartTotal: total };
    }),

  clearCart: () => set({ cartItems: [], cartTotal: 0 }),

  toggleWishlist: (productId) =>
    set((state) => {
      const isIn = state.wishlistIds.includes(productId);
      return {
        wishlistIds: isIn
          ? state.wishlistIds.filter((id) => id !== productId)
          : [...state.wishlistIds, productId],
        products: state.products.map((p) =>
          p.id === productId ? { ...p, isFavorite: !isIn } : p
        ),
      };
    }),

  isInWishlist: (productId) => get().wishlistIds.includes(productId),

  placeOrder: (paymentMethod) => {
    const state = get();
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      userId: 'u1',
      items: state.cartItems.map((item) => ({
        productId: item.productId,
        product: item.product,
        quantity: item.quantity,
        price: item.price,
        sellerId: item.sellerId,
        status: 'pending' as OrderStatus,
      })),
      totalPrice: state.cartTotal + 400,
      subtotal: state.cartTotal,
      deliveryFee: 400,
      status: 'pending',
      shippingAddress: {
        id: 'a1',
        userId: 'u1',
        label: 'Maison',
        street: '12 Rue Didouche Mourad',
        city: 'Alger Centre',
        wilaya: 'Alger',
        postalCode: '16000',
        phone: '+213 555 123 456',
        isDefault: true,
        latitude: 36.7538,
        longitude: 3.0588,
      },
      paymentMethod,
      trackingId: `TRK-${Date.now()}`,
      estimatedDelivery: '2-4 jours',
      createdAt: new Date(),
    };

    set((s) => ({
      orders: [newOrder, ...s.orders],
      cartItems: [],
      cartTotal: 0,
    }));

    return newOrder;
  },

  getProductById: (id) => get().products.find((p) => p.id === id),

  getOrderById: (id) => get().orders.find((o) => o.id === id),

  getFilteredProducts: () => {
    const { products, selectedCategory, searchQuery } = get();
    let filtered = [...products];
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return filtered;
  },
}));