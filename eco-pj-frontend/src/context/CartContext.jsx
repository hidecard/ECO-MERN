import { createContext, useState, useEffect, useContext } from 'react';
import { getCart, addToCart, updateCart, removeFromCart } from '../lib/api';

// Create CartContext
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);

  // Fetch cart on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const cartData = await getCart(token);
          setCart(cartData);
        }
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      }
    };
    fetchCart();
  }, []);

  const addItem = async (productId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      const updatedCart = await addToCart(token, productId, quantity);
      setCart(updatedCart);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  };

  const updateItem = async (productId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      const updatedCart = await updateCart(token, productId, quantity);
      setCart(updatedCart);
    } catch (error) {
      console.error('Failed to update cart:', error);
      throw error;
    }
  };

  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const updatedCart = await removeFromCart(token, productId);
      setCart(updatedCart);
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    }
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addItem, updateItem, removeItem }}>
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