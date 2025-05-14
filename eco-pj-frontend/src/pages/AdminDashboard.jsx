import { useState, useEffect } from 'react';
import { getAdminProducts, getAdminOrders, getAdminUsers, deleteAdminUser } from '../lib/api';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const productsData = await getAdminProducts(token);
        const ordersData = await getAdminOrders(token);
        const usersData = await getAdminUsers(token);
        setProducts(productsData);
        setOrders(ordersData);
        setUsers(usersData);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      }
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await deleteAdminUser(token, userId);
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Products</h2>
      {products.map(product => (
        <div key={product._id}>
          <h3>{product.name}</h3>
          <p>Price: ${product.price}</p>
        </div>
      ))}
      <h2>Orders</h2>
      {orders.map(order => (
        <div key={order._id}>
          <h3>Order ID: {order._id}</h3>
          <p>Total: ${order.total}</p>
          <p>Status: {order.status}</p>
        </div>
      ))}
      <h2>Users</h2>
      {users.map(user => (
        <div key={user._id}>
          <h3>{user.name}</h3>
          <p>Email: {user.email}</p>
          <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;