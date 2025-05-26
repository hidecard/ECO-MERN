import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../lib/api';

function CheckoutForm() {
  const { cart, setCart } = useCart();
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to checkout');
        navigate('/login');
        return;
      }
      await createOrder(token, { shippingInfo });
      setCart({ items: [] });
      navigate('/orders');
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Checkout error:', error);
      setError(error.message || 'Failed to place order');
    } finally {
      setProcessing(false);
    }
  };

  const total = cart?.items?.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  ) || 0;

  return (
    <div className="container mx-auto p-8 max-w-lg">
      <h1 className="text-5xl font-extrabold text-orange-600 mb-10">Checkout</h1>
      {cart?.items?.length === 0 ? (
        <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18M3 3l2 18h14l2-18H3zm5 7h8" />
          </svg>
          <p className="mt-4 text-xl text-gray-600">Your cart is empty.</p>
          <Link to="/products" className="mt-4 inline-block text-orange-500 hover:text-orange-600 font-semibold">
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 p-8">
          <h2 className="text-2xl font-extrabold text-gray-800 mb-6">
            Order Summary (${total.toFixed(2)})
          </h2>
          <div className="border-t border-gray-200 pt-4 mb-6">
            {cart.items.map(item => (
              <div key={item.productId._id} className="flex justify-between mb-3 text-gray-700">
                <span className="truncate">{item.productId.name} (x{item.quantity})</span>
                <span>${(item.productId.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit}>
            <h3 className="text-xl font-extrabold text-orange-600 mb-4">Shipping Information</h3>
            <div className="grid gap-6">
              <div className="relative">
                <input
                  type="text"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  className="peer border rounded-lg p-3 w-full focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                  required
                  placeholder=" "
                />
                <label className="absolute top-0 left-3 -translate-y-1/2 bg-white/80 px-1 text-gray-700 text-sm peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 transition-all">
                  Address
                </label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                  className="peer border rounded-lg p-3 w-full focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                  required
                  placeholder=" "
                />
                <label className="absolute top-0 left-3 -translate-y-1/2 bg-white/80 px-1 text-gray-700 text-sm peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 transition-all">
                  City
                </label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="postalCode"
                  value={shippingInfo.postalCode}
                  onChange={handleInputChange}
                  className="peer border rounded-lg p-3 w-full focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                  required
                  placeholder=" "
                />
                <label className="absolute top-0 left-3 -translate-y-1/2 bg-white/80 px-1 text-gray-700 text-sm peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 transition-all">
                  Postal Code
                </label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="country"
                  value={shippingInfo.country}
                  onChange={handleInputChange}
                  className="peer border rounded-lg p-3 w-full focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                  required
                  placeholder=" "
                />
                <label className="absolute top-0 left-3 -translate-y-1/2 bg-white/80 px-1 text-gray-700 text-sm peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 transition-all">
                  Country
                </label>
              </div>
            </div>
            {error && (
              <div className="mt-4 p-4 bg-red-100/80 backdrop-blur-sm text-red-700 rounded-lg flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={processing}
              className="mt-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 focus:ring-2 focus:ring-orange-500 w-full disabled:bg-orange-300 disabled:cursor-not-allowed transition-all duration-300"
            >
              {processing ? 'Processing...' : `Place Order ($${total.toFixed(2)})`}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function Checkout() {
  return <CheckoutForm />;
}

export default Checkout;