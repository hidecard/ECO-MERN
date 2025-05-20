// C:\Users\Lenovo\Desktop\ECO MERN\eco-pj-frontend\src\pages\Orders.jsx
import { useState, useEffect } from 'react';
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
    <div className="container mx-auto p-4 text-center">
      <svg className="animate-spin h-8 w-8 text-orange-600 mx-auto" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
      </svg>
      <p className="mt-2 text-gray-600">Loading...</p>
    </div>
  );

  if (error) return (
    <div className="container mx-auto p-4 text-center text-red-500">
      {error}
      <button
        onClick={() => window.location.reload()}
        className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">Your Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-xl font-semibold text-gray-800">Order ID: {order._id}</h3>
              <p className="text-gray-600">Total: ${order.total.toFixed(2)}</p>
              <p className="text-gray-600">Status: {order.status}</p>
              <h4 className="text-lg font-semibold text-orange-600 mt-2">Items:</h4>
              {order.items.map(item => (
                <div key={item.productId._id} className="ml-4 mt-2">
                  <p className="text-gray-800">{item.productId.name}</p>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-gray-600">Price: ${item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;