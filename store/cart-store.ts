import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartState, CartItem } from '@/types/cart';

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promocode: null,

      addItem: (item) => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({
          items: [...state.items, { ...item, id }],
        }));
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      applyPromo: (code) => {
        set({ promocode: code });
      },

      removePromo: () => {
        set({ promocode: null });
      },

      clearCart: () => {
        set({ items: [], promocode: null });
      },

      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price, 0);
      },
    }),
    {
      name: 'asianodes-cart', // unique name for localStorage key
    }
  )
);
