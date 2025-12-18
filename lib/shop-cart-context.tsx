'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// =============================================
// TYPES
// =============================================

export interface CartItem {
  productId: string;
  productName: string;
  variantId: string;
  variantSku: string;
  size: string;
  color: string;
  quantity: number;
  priceCents: number;
  imageUrl?: string;
}

interface ShopCartContextType {
  items: CartItem[];
  itemCount: number;
  totalCents: number;
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

// =============================================
// CONTEXT
// =============================================

const ShopCartContext = createContext<ShopCartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'cs-society-shop-cart';

// =============================================
// PROVIDER
// =============================================

export function ShopCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setItems(parsed);
      }
    } catch (error) {
      console.error('[Shop Cart] Failed to load from localStorage:', error);
    }
    setIsHydrated(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error('[Shop Cart] Failed to save to localStorage:', error);
      }
    }
  }, [items, isHydrated]);

  // Calculate totals
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalCents = items.reduce(
    (sum, item) => sum + item.priceCents * item.quantity,
    0
  );

  // Add item to cart
  const addItem = (newItem: CartItem) => {
    setItems(currentItems => {
      // Check if item already exists
      const existingIndex = currentItems.findIndex(
        item => item.variantId === newItem.variantId
      );

      if (existingIndex >= 0) {
        // Update quantity
        const updated = [...currentItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + newItem.quantity,
        };
        return updated;
      } else {
        // Add new item
        return [...currentItems, newItem];
      }
    });

    // Open cart drawer to show confirmation
    setIsOpen(true);
  };

  // Remove item from cart
  const removeItem = (variantId: string) => {
    setItems(currentItems =>
      currentItems.filter(item => item.variantId !== variantId)
    );
  };

  // Update item quantity
  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.variantId === variantId ? { ...item, quantity } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
    setIsOpen(false);
  };

  // Cart drawer controls
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const value: ShopCartContextType = {
    items,
    itemCount,
    totalCents,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isOpen,
    openCart,
    closeCart,
  };

  return (
    <ShopCartContext.Provider value={value}>
      {children}
    </ShopCartContext.Provider>
  );
}

// =============================================
// HOOK
// =============================================

export function useShopCart() {
  const context = useContext(ShopCartContext);
  if (context === undefined) {
    throw new Error('useShopCart must be used within ShopCartProvider');
  }
  return context;
}

// =============================================
// HELPER FUNCTIONS
// =============================================

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
