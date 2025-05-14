import { createContext, useState, useEffect, useContext } from 'react';
import { getCart, addToCart, updateCart, removeFromCart, createOrder } from '../lib/api';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState({ items: [] });

  const fetchCart = async () => {
    if (!user) return;
    try {
      const response = await getCart();
      setCart(response.data);
    } catch (error) {
      toast.error('Failed to fetch cart');
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addItem = async (productId, quantity) => {
    try {
      const response = await addToCart({ productId, quantity });
      setCart(response.data);
      toast.success('Added to cart');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const updateItem = async (productId, quantity) => {
    try {
      const response = await updateCart({ productId, quantity });
      setCart(response.data);
      toast.success('Cart updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update cart');
    }
  };

  const removeItem = async (productId) => {
    try {
      const response = await removeFromCart(productId);
      setCart(response.data);
      toast.success('Removed from cart');
    } catch (error) {
      toast.error('Failed to remove from cart');
    }
  };

  const checkout = async (shippingInfo, paymentMethod) => {
    try {
      const response = await createOrder({ shippingInfo, paymentMethod });
      setCart({ items: [] }); // Clear cart
      toast.success('Order placed successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Checkout failed');
      throw error;
    }
  };

  return (
    <CartContext.Provider value={{ cart, addItem, updateItem, removeItem, checkout }}>
      {children}
    </CartContext.Provider>
  );
};