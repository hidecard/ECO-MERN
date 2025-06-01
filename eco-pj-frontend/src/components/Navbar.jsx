import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { token, cart, setToken } = useCart();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  useEffect(() => {
    const checkAdmin = async () => {
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/admin/users', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsAdmin(response.ok);
        } catch (error) {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, [token]);

  return (
    <nav className="sticky top-0 bg-white/90 backdrop-blur-sm shadow-md p-4 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-orange-600 text-2xl sm:text-3xl font-extrabold tracking-tight">YHA Shop</Link>
        <button
          className="md:hidden text-gray-800 hover:text-orange-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        <div className={`md:flex md:space-x-6 items-center ${isMenuOpen ? 'block' : 'hidden'} absolute md:static top-16 left-0 w-full md:w-auto bg-white/90 md:bg-transparent p-4 md:p-0`}>
          {!isAdmin ? (
            <>
              <Link to="/" className="block md:inline-block text-gray-800 hover:text-orange-600 transition duration-300 mb-2 md:mb-0" aria-label="Home">Home</Link>
              {token && (
                <>
                  <Link to="/wishlist" className="block md:inline-block relative text-gray-800 hover:text-orange-600 transition duration-300 mb-2 md:mb-0" aria-label="Wishlist">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 0 4.5 4.5 0 010 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                    </svg>
                  </Link>
                  <Link to="/orders" className="block md:inline-block relative text-gray-800 hover:text-orange-600 transition duration-300 mb-2 md:mb-0" aria-label="Orders">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10h6m-6 0H3m12 0h6M9 7h6M9 7H3m12 0h6" />
                    </svg>
                  </Link>
                  <Link to="/cart" className="block md:inline-block relative text-gray-800 hover:text-orange-600 transition duration-300 mb-2 md:mb-0" aria-label="Cart">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18M3 3l2 18h14l2-18H3zm5 7h8" />
                    </svg>
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                </>
              )}
              {!token && (
                <>
                  <Link to="/login" className="block md:inline-block text-gray-800 hover:text-orange-600 transition duration-300 mb-2 md:mb-0" aria-label="Login">Login</Link>
                  <Link to="/register" className="block md:inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-xl hover:from-orange-600 hover:to-orange-700 focus:ring-2 focus:ring-orange-500 transition-all duration-300" aria-label="Register">Register</Link>
                </>
              )}
            </>
          ) : (
            <>
              <Link to="/admin" className="block md:inline-block text-gray-800 hover:text-orange-600 transition duration-300 mb-2 md:mb-0" aria-label="Admin Dashboard">Dashboard</Link>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  setToken(null);
                  window.location.reload();
                }}
                className="block md:inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-xl hover:from-orange-600 hover:to-orange-700 focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;