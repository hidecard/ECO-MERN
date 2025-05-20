import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      setCart({ items: [] }); // Clear cart
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
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">Checkout</h1>
      {cart?.items?.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Order Summary (${total.toFixed(2)})
          </h2>
          {cart.items.map(item => (
            <div key={item.productId._id} className="flex justify-between mb-2">
              <span>{item.productId.name} (x{item.quantity})</span>
              <span>${(item.productId.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <form onSubmit={handleSubmit} className="mt-6">
            <h3 className="text-lg font-semibold text-orange-600 mb-2">Shipping Information</h3>
            <label className="block mb-2">
              Address:
              <input
                type="text"
                name="address"
                value={shippingInfo.address}
                onChange={handleInputChange}
                className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-orange-500"
                required
              />
            </label>
            <label className="block mb-2">
              City:
              <input
                type="text"
                name="city"
                value={shippingInfo.city}
                onChange={handleInputChange}
                className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-orange-500"
                required
              />
            </label>
            <label className="block mb-2">
              Postal Code:
              <input
                type="text"
                name="postalCode"
                value={shippingInfo.postalCode}
                onChange={handleInputChange}
                className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-orange-500"
                required
              />
            </label>
            <label className="block mb-4">
              Country:
              <input
                type="text"
                name="country"
                value={shippingInfo.country}
                onChange={handleInputChange}
                className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-orange-500"
                required
              />
            </label>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              type="submit"
              disabled={processing}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 w-full disabled:bg-orange-300"
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