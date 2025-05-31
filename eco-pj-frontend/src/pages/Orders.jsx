import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../lib/api';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view orders');
          setLoading(false);
          return;
        }
        const data = await getOrders(token);
        console.log('Orders data:', data);
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setError(error.message || 'Failed to load orders');
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return (
    <div className="container mx-auto p-8 text-center">
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500"></div>
      </div>
      <p className="mt-4 text-xl text-gray-600">Loading orders...</p>
    </div>
  );

  if (error) return (
    <div className="container mx-auto p-8 text-center">
      <p className="text-lg text-red-500">{error}</p>
      <Link to="/" className="mt-4 inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 focus:ring-2 focus:ring-orange-500 transition-all duration-300">
        Browse Products
      </Link>
    </div>
  );

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-5xl font-extrabold text-orange-600 mb-10">Your Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10h6m-6 0H3m12 0h6M9 7h6M9 7H3m12 0h6" />
          </svg>
          <p className="mt-4 text-xl text-gray-600">No orders found.</p>
          <Link to="/products" className="mt-4 inline-block text-orange-500 hover:text-orange-600 font-semibold">
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-gray-800">Order ID: {order._id}</h3>
              <p className="text-gray-600">Total: ${order.total.toFixed(2)}</p>
              <p className="text-gray-600">Status: {order.status}</p>
              <h4 className="text-lg font-extrabold text-orange-600 mt-4">Items:</h4>
              <div className="ml-4 mt-2 space-y-2">
                {order.items.map(item => (
                  <div key={item.productId._id} className="flex justify-between">
                    <div>
                      <p className="text-gray-800">{item.productId.name}</p>
                      <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                    </div>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;