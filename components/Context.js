"use client";

import React, { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  // ── CART ──────────────────────────────────────────────────────────

  const addToCart = (product, variation) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(
        item => item.id === product.id && item.variationName === variation.name
      );
      if (existingIdx !== -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + 1
        };
        return updated;
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          variationName: variation.name,
          image: variation.defaultImage,
          quantity: 1
        }
      ];
    });
  };

  const removeFromCart = (id, variationName) => {
    setCartItems(prev =>
      prev.filter(item => !(item.id === id && item.variationName === variationName))
    );
  };

  const updateQuantity = (id, variationName, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id, variationName);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === id && item.variationName === variationName
          ? { ...item, quantity }
          : item
      )
    );
  };

  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = cartItems.reduce((sum, item) => {
    const price = parseFloat((item.price || "0").replace(",", ""));
    return sum + item.quantity * price;
  }, 0);

  // ── WISHLIST ───────────────────────────────────────────────────────

  const addToWishlist = (product, variation) => {
    setWishlistItems(prev => {
      const exists = prev.some(
        item => item.id === product.id && item.variationName === variation.name
      );
      if (exists) return prev; // already in wishlist, do nothing
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          variationName: variation.name,
          image: variation.defaultImage
        }
      ];
    });
  };

  const removeFromWishlist = (id, variationName) => {
    setWishlistItems(prev =>
      prev.filter(item => !(item.id === id && item.variationName === variationName))
    );
  };

  const isInWishlist = (id, variationName) =>
    wishlistItems.some(item => item.id === id && item.variationName === variationName);

  const wishlistCount = wishlistItems.length;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalCount,
        totalPrice,
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        wishlistCount
      }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}