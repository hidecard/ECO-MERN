import { useState, useEffect } from 'react';
import { getOrders } from '../lib/api';

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await getOrders(token);
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h1>Your Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map(order => (
          <div key={order._id}>
            <h3>Order ID: {order._id}</h3>
            <p>Total: ${order.total}</p>
            <p>Status: {order.status}</p>
            <h4>Items:</h4>
            {order.items.map(item => (
              <div key={item.productId._id}>
                <p>{item.productId.name}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${item.price}</p>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;