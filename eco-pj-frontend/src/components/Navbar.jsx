import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { token } = useCart();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/admin/users', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            setIsAdmin(true);
          }
        } catch (error) {
          console.error('Failed to check admin status:', error);
        }
      }
    };
    checkAdmin();
  }, [token]);

  return (
    <nav className="bg-orange-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">YHA Shop</Link>
        <div className="space-x-4">
          <Link to="/" className="text-white hover:text-orange-200">Home</Link>
          <Link to="/cart" className="text-white hover:text-orange-200">Cart</Link>
          {token ? (
            <>
              {isAdmin && (
                <>
                  <Link to="/admin/products" className="text-white hover:text-orange-200">Products</Link>
                  <Link to="/admin/orders" className="text-white hover:text-orange-200">Orders</Link>
                  <Link to="/admin/users" className="text-white hover:text-orange-200">Users</Link>
                  <Link to="/admin/categories" className="text-white hover:text-orange-200">Categories</Link>
                </>
              )}
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.reload();
                }}
                className="text-white hover:text-orange-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-orange-200">Login</Link>
              <Link to="/register" className="text-white hover:text-orange-200">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;