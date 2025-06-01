import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { updateCart, removeFromCart } from '../lib/api';
import { toast } from 'react-toastify';

function Cart() {
  const { cart, token, setCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) return;
    setLoading(true);
    try {
      const updatedCart = await updateCart(token, productId, quantity);
      setCart(updatedCart);
      toast.success('Cart updated');
    } catch (error) {
      toast.error(error.message || 'Failed to update cart');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    setLoading(true);
    try {
      const updatedCart = await removeFromCart(token, productId);
      setCart(updatedCart);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error(error.message || 'Failed to remove item');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cart?.items?.reduce((sum, item) => sum + item.quantity * item.productId.price, 0) || 0;
  };

  if (!token) return null;

  if (!cart || cart.items.length === 0) return (
    <div className="container mx-auto p-4 text-center">
      <p className="text-gray-600 text-lg">Your cart is empty.</p>
      <Link to="/" className="mt-4 inline-block bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
        Continue Shopping
      </Link>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">Your Cart</h1>
      <div className="space-y-4">
        {cart.items.map(item => (
          <div key={item._id} className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <img
                src={item.productId.imageURLs?.[0] || 'https://via.placeholder.com/100'}
                alt={item.productId.name}
                className="w-20 h-20 rounded-lg mr-4"
              />
              <div>
                <p className="text-gray-800 font-medium">{item.productId.name}</p>
                <p className="text-gray-600">${item.productId.price.toFixed(2)} each</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange(item.productId._id, item.quantity - 1)}
                  className="bg-gray-200 px-2 py-1 rounded-l-lg hover:bg-gray-300"
                  disabled={loading || item.quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-1 bg-gray-100">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.productId._id, item.quantity + 1)}
                  className="bg-gray-200 px-2 py-1 rounded-r-lg hover:bg-gray-300"
                  disabled={loading}
                >
                  +
                </button>
              </div>
              <p className="text-gray-800 font-medium">${(item.quantity * item.productId.price).toFixed(2)}</p>
              <button
                onClick={() => handleRemove(item.productId._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                disabled={loading}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 bg-white rounded-lg shadow-md p-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-orange-600">Total: ${calculateTotal().toFixed(2)}</h2>
        <Link
          to="/checkout"
          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}

export default Cart;