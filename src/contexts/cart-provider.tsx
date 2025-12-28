'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { useAuth } from '@clerk/nextjs';
import { cartApi, type CartItem } from '@/lib/api';

interface LocalCartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  image: string;
}

interface CartContextType {
  cart: LocalCartItem[];
  addToCart: (item: Omit<LocalCartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  isLoading: boolean;
  syncCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'footies_shop_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<LocalCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isSignedIn, getToken } = useAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        try {
          setCart(JSON.parse(storedCart));
        } catch (e) {
          console.error('Failed to parse cart from localStorage:', e);
          localStorage.removeItem(CART_STORAGE_KEY);
        }
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart]);

  // Sync cart with server when user signs in
  const syncCart = useCallback(async () => {
    if (!isSignedIn) return;

    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) return;

      // Get server cart
      const response = await cartApi.get(token);

      if (response.success && response.data) {
        // Merge local cart with server cart
        const serverItems = response.data.items || [];
        const localItems = [...cart];

        // Add local items to server if not already there
        for (const localItem of localItems) {
          const existsOnServer = serverItems.some(
            (s: CartItem) => s.productId === localItem.productId && s.size === localItem.size
          );

          if (!existsOnServer) {
            await cartApi.addItem(token, localItem.productId, localItem.quantity, localItem.size);
          }
        }

        // Update local cart with server items
        const mergedCart: LocalCartItem[] = serverItems.map((item: CartItem) => ({
          productId: item.productId,
          name: item.product?.name || '',
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          image: item.product?.images?.[0] || '',
        }));

        // Add any local items not on server
        for (const localItem of localItems) {
          const existsInMerged = mergedCart.some(
            m => m.productId === localItem.productId && m.size === localItem.size
          );
          if (!existsInMerged) {
            mergedCart.push(localItem);
          }
        }

        setCart(mergedCart);
      }
    } catch (error) {
      console.error('Failed to sync cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn, getToken, cart]);

  // Sync when user signs in
  useEffect(() => {
    if (isSignedIn) {
      syncCart();
    }
  }, [isSignedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  const addToCart = useCallback(async (
    item: Omit<LocalCartItem, 'quantity'>,
    quantity = 1
  ) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (i) => i.productId === item.productId && i.size === item.size
      );

      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      }

      return [...prevCart, { ...item, quantity }];
    });

    // Sync with server if signed in
    if (isSignedIn) {
      try {
        const token = await getToken();
        if (token) {
          await cartApi.addItem(token, item.productId, quantity, item.size);
        }
      } catch (error) {
        console.error('Failed to add item to server cart:', error);
      }
    }
  }, [isSignedIn, getToken]);

  const removeFromCart = useCallback(async (productId: string, size?: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.productId === productId && item.size === size)
      )
    );

    // Sync with server if signed in
    if (isSignedIn) {
      try {
        const token = await getToken();
        if (token) {
          // Note: We'd need the cart item ID from the server
          // For now, we'll rely on the next sync
        }
      } catch (error) {
        console.error('Failed to remove item from server cart:', error);
      }
    }
  }, [isSignedIn, getToken]);

  const updateQuantity = useCallback(async (
    productId: string,
    quantity: number,
    size?: string
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isLoading,
        syncCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
