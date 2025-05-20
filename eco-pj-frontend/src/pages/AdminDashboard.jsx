import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminProducts, getAdminOrders, getAdminUsers, deleteAdminUser } from '../lib/api';
import { useCart } from '../context/CartContext';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!token) {
        setError('Please log in as an admin');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        console.log('Fetching admin data with token:', token.slice(0, 10) + '...');
        const [productsData, ordersData, usersData] = await Promise.all([
          getAdminProducts(token),
          getAdminOrders(token),
          getAdminUsers(token),
        ]);
        console.log('Admin products:', productsData);
        console.log('Admin orders:', ordersData);
        console.log('Admin users:', usersData);
        setProducts(productsData);
        setOrders(ordersData);
        setUsers(usersData);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
        setError(error.message || 'Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, [token]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      console.log('Deleting user:', userId);
      await deleteAdminUser(token, userId);
      setUsers(users.filter(user => user._id !== userId));
      alert('User deleted successfully');
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert(error.message || 'Failed to delete user');
    }
  };

  if (!token) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-red-500">Please log in as an admin to access the dashboard.</p>
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
      <p className="mt-2 text-gray-600">Loading admin data...</p>
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
      <h1 className="text-3xl font-bold text-orange-600 mb-6 text-center">Admin Dashboard - YHA Shop</h1>

      {/* Products Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-orange-600 mb-4">Products</h2>
        {products.length === 0 ? (
          <p className="text-gray-600">No products available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(product => (
              <div key={product._id} className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                <p className="text-gray-600">Price: ${product.price.toFixed(2)}</p>
                <p className="text-gray-600">Stock: {product.stock}</p>
                <p className="text-gray-600">Category: {product.categoryId?.name || 'Uncategorized'}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Orders Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-orange-600 mb-4">Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-600">No orders available.</p>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-lg shadow-md p-4">
                <p className="text-gray-800">Order ID: {order._id}</p>
                <p className="text-gray-600">User: {order.userId?.name || 'Unknown'}</p>
                <p className="text-gray-600">Total: ${order.total.toFixed(2)}</p>
                <p className="text-gray-600">Status: {order.status}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Users Section */}
      <section>
        <h2 className="text-2xl font-semibold text-orange-600 mb-4">Users</h2>
        {users.length === 0 ? (
          <p className="text-gray-600">No users available.</p>
        ) : (
          <div className="space-y-4">
            {users.map(user => (
              <div key={user._id} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
                <div>
                  <p className="text-gray-800">Name: {user.name}</p>
                  <p className="text-gray-600">Email: {user.email}</p>
                  <p className="text-gray-600">Role: {user.role}</p>
                </div>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  disabled={user.role === 'admin'}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;