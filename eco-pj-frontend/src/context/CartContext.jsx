import { createContext, useContext, useState, useEffect } from 'react';
import { addToCart, getCart, removeFromCart, updateCart } from '../lib/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const fetchCart = async () => {
      if (token) {
        try {
          const cartData = await getCart(token);
          setCart(cartData);
        } catch (error) {
          console.error('Failed to fetch cart:', error);
        }
      }
    };
    fetchCart();
  }, [token]);

  const addItem = async (productId, quantity) => {
    try {
      const updatedCart = await addToCart(token, productId, quantity);
      setCart(updatedCart);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const updateItem = async (productId, quantity) => {
    try {
      const updatedCart = await updateCart(token, productId, quantity);
      setCart(updatedCart);
    } catch (error) {
      console.error('Failed to update cart:', error);
    }
  };

  const removeItem = async (productId) => {
    try {
      const updatedCart = await removeFromCart(token, productId);
      setCart(updatedCart);
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addItem, updateItem, removeItem, setToken }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);