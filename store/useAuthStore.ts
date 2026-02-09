import { create } from 'zustand';
import { User, Address } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  language: 'fr' | 'ar';

  login: (phone: string) => Promise<void>;
  verifyOtp: (code: string) => Promise<boolean>;
  signup: (data: Partial<User>) => Promise<void>;
  logout: () => void;
  setLanguage: (lang: 'fr' | 'ar') => void;
  updateProfile: (data: Partial<User>) => void;
}

const defaultUser: User = {
  id: 'u1',
  phone: '+213 555 123 456',
  name: 'Karim Bouzid',
  email: 'karim.bouzid@email.com',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  preferredLanguage: 'fr',
  createdAt: new Date(),
  addresses: [
    {
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
    {
      id: 'a2',
      userId: 'u1',
      label: 'Bureau',
      street: '45 Boulevard Mohamed V',
      city: 'Bab Ezzouar',
      wilaya: 'Alger',
      postalCode: '16031',
      phone: '+213 555 789 012',
      isDefault: false,
      latitude: 36.7192,
      longitude: 3.1838,
    },
  ],
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  language: 'fr',

  login: async (_phone: string) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1200));
    set({ isLoading: false });
  },

  verifyOtp: async (_code: string) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 800));
    set({ user: defaultUser, isAuthenticated: true, isLoading: false });
    return true;
  },

  signup: async (data: Partial<User>) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set({
      user: { ...defaultUser, ...data },
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  setLanguage: (lang: 'fr' | 'ar') => {
    set({ language: lang });
  },

  updateProfile: (data: Partial<User>) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    }));
  },
}));