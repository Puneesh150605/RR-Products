import React, { createContext, useContext, useState, useMemo } from 'react';

const CartContext = createContext();
export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  
  function addToCart(product, quantity = 1) {
    setCart(prev => {
      const idx = prev.findIndex(p => p._id === product._id);
      if (idx !== -1) {
        // Already in cart, increment qty
        return prev.map((item,i) => i === idx ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
  }
  
  function removeFromCart(id) {
    setCart(prev => prev.filter(p => p._id !== id));
  }
  
  function clearCart() {
    setCart([]);
  }

  function updateQuantity(id, quantity) {
    setCart(prev => prev.map(item => item._id === id ? { ...item, quantity } : item));
  }

  const value = useMemo(() => ({ cart, addToCart, removeFromCart, clearCart, updateQuantity }), [cart]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

