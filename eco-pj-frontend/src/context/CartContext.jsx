import { createContext, useState, useEffect, useContext } from 'react';
import { getCart, addToCart, updateCart, removeFromCart } from '../lib/api';

// Create CartContext
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // Fetch cart on mount or token change
  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (token) {
          const cartData = await getCart(token);
          setCart(cartData);
        } else {
          setCart(null);
        }
      } catch (error) {
        console.error('Failed to fetch cart:', error);
        setCart(null);
      }
    };
    fetchCart();
  }, [token]);

  const addItem = async (productId, quantity) => {
    try {
      if (!token) throw new Error('Please log in to add items to cart');
      const updatedCart = await addToCart(token, productId, quantity);
      setCart(updatedCart);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  };

  const updateItem = async (productId, quantity) => {
    try {
      if (!token) throw new Error('Please log in to update cart');
      const updatedCart = await updateCart(token, productId, quantity);
      setCart(updatedCart);
    } catch (error) {
      console.error('Failed to update cart:', error);
      throw error;
    }
  };

  const removeItem = async (productId) => {
    try {
      if (!token) throw new Error('Please log in to remove items from cart');
      const updatedCart = await removeFromCart(token, productId);
      setCart(updatedCart);
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    }
  };

  return (
    <CartContext.Provider value={{ cart, setCart, token, setToken, addItem, updateItem, removeItem }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};