import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../lib/api';
import { toast } from 'react-toastify';

function Checkout() {
  const { cart, token, setCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderData = {
        items: cart.items.map(item => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.productId.price,
        })),
        total: calculateTotal(),
        shippingAddress: form,
      };
      await createOrder(token, orderData);
      setCart({ items: [] });
      toast.success('Order placed successfully');
      navigate('/orders');
    } catch (error) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cart?.items?.reduce((sum, item) => sum + item.quantity * item.productId.price, 0) || 0;
  };

  if (!token) {
    navigate('/login');
    return null;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-gray-600 text-lg">Your cart is empty.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-orange-600 mb-4">Shipping Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Postal Code</label>
              <input
                type="text"
                value={form.postalCode}
                onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Country</label>
              <input
                type="text"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-orange-600 mb-4">Order Summary</h2>
          <div className="space-y-2">
            {cart.items.map(item => (
              <div key={item._id} className="flex justify-between">
                <p className="text-gray-600">{item.productId.name} x {item.quantity}</p>
                <p className="text-gray-800">${(item.quantity * item.productId.price).toFixed(2)}</p>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <p className="text-xl font-bold text-orange-600">Total: ${calculateTotal().toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;