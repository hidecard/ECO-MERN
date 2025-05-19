import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getAdminOrders, updateAdminOrder } from '../lib/api';

function OrdersAdmin() {
  const { token } = useCart();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError('Please log in as an admin');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const ordersData = await getAdminOrders(token);
        setOrders(ordersData);
      } catch (error) {
        setError(error.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleUpdateStatus = async (id, status) => {
    try {
      const updatedOrder = await updateAdminOrder(token, id, { status });
      setOrders(orders.map(o => (o._id === id ? updatedOrder : o)));
      alert('Order status updated');
    } catch (error) {
      alert(error.message || 'Failed to update order');
    }
  };

  if (!token) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-red-500">Please log in as an admin.</p>
        <button
          onClick={() => navigate('/login')}
          className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
        >
          Go to Login
        </button>
      </div>
    );
  }

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
      <h1 className="text-3xl font-bold text-orange-600 mb-6">Manage Orders</h1>
      <h2 className="text-2xl font-semibold text-orange-600 mb-4">Orders List</h2>
      {orders.length === 0 ? (
        <p className="text-gray-600">No orders available.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-lg shadow-md p-4">
              <p className="text-gray-800">Order ID: {order._id}</p>
              <p className="text-gray-600">User: {order.userId?.name || 'Unknown'}</p>
              <p className="text-gray-600">Total: ${order.total.toFixed(2)}</p>
              <div className="flex items-center space-x-2">
                <p className="text-gray-600">Status:</p>
                <select
                  value={order.status}
                  onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                  className="border rounded-lg p-2"
                >
                  {['pending', 'processing', 'shipped', 'delivered'].map(status => (
                    <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersAdmin;