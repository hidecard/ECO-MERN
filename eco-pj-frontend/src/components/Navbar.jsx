import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

function Navbar() {
  const { cart } = useContext(CartContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); // Assume role is stored after login

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav className="bg-orange-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          YHA Shop
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="hover:text-orange-200">Home</Link>
          <Link to="/products" className="hover:text-orange-200">Shop</Link>
          <Link to="/cart" className="hover:text-orange-200">
            Cart ({cart?.items?.length || 0})
          </Link>
          <Link to="/wishlist" className="hover:text-orange-200">Wishlist</Link>
          <Link to="/orders" className="hover:text-orange-200">Orders</Link>
          {userRole === 'admin' && (
            <Link to="/admin" className="hover:text-orange-200">Admin</Link>
          )}
          {token ? (
            <button onClick={handleLogout} className="hover:text-orange-200">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="hover:text-orange-200">Login</Link>
              <Link to="/register" className="hover:text-orange-200">Register</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-orange-500 px-4 py-2">
          <Link to="/" className="block py-2 hover:text-orange-200" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/products" className="block py-2 hover:text-orange-200" onClick={() => setIsOpen(false)}>Shop</Link>
          <Link to="/cart" className="block py-2 hover:text-orange-200" onClick={() => setIsOpen(false)}>
            Cart ({cart?.items?.length || 0})
          </Link>
          <Link to="/wishlist" className="block py-2 hover:text-orange-200" onClick={() => setIsOpen(false)}>Wishlist</Link>
          <Link to="/orders" className="block py-2 hover:text-orange-200" onClick={() => setIsOpen(false)}>Orders</Link>
          {userRole === 'admin' && (
            <Link to="/admin" className="block py-2 hover:text-orange-200" onClick={() => setIsOpen(false)}>Admin</Link>
          )}
          {token ? (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="block py-2 hover:text-orange-200"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="block py-2 hover:text-orange-200" onClick={() => setIsOpen(false)}>Login</Link>
              <Link to="/register" className="block py-2 hover:text-orange-200" onClick={() => setIsOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;