'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from './types';

let cartCounter = 0;

interface CartStore {
  items: CartItem[];
  wishlist: number[];
  addItem: (product: Product, qty?: number, size?: number | null, color?: string) => void;
  removeItem: (cartId: number) => void;
  updateQty: (cartId: number, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: number) => void;
  count: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      wishlist: [],

      addItem: (product, qty = 1, size = null, color = product.colors[0]) => {
        set((state) => {
          // if no size/color specified (quick add), merge by id
          if (!size) {
            const existing = state.items.find((i) => i.id === product.id && !i.selectedSize);
            if (existing) {
              return {
                items: state.items.map((i) =>
                  i.cartId === existing.cartId ? { ...i, qty: i.qty + qty } : i
                ),
              };
            }
          }
          return {
            items: [
              ...state.items,
              {
                ...product,
                cartId: ++cartCounter,
                qty,
                selectedSize: size,
                selectedColor: color ?? product.colors[0],
              },
            ],
          };
        });
      },

      removeItem: (cartId) =>
        set((state) => ({ items: state.items.filter((i) => i.cartId !== cartId) })),

      updateQty: (cartId, qty) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.cartId === cartId ? { ...i, qty: Math.max(1, qty) } : i
          ),
        })),

      clearCart: () => set({ items: [] }),

      toggleWishlist: (id) =>
        set((state) => ({
          wishlist: state.wishlist.includes(id)
            ? state.wishlist.filter((w) => w !== id)
            : [...state.wishlist, id],
        })),

      count: () => get().items.reduce((s, i) => s + i.qty, 0),
    }),
    { name: 'zyra-cart', version: 1 }
  )
);
