import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, signOut } = useContext(AuthContext);

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">ECO PJ</Link>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search products..."
            className="px-3 py-1 rounded-md focus:outline-none"
          />
          <Link to="/cart" className="text-white hover:text-gray-200">Cart</Link>
          <Link to="/wishlist" className="text-white hover:text-gray-200">Wishlist</Link>
          {user ? (
            <>
              <Link to="/profile" className="text-white hover:text-gray-200">Profile</Link>
              <button
                onClick={signOut}
                className="text-white hover:text-gray-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-gray-200">Login</Link>
              <Link to="/register" className="text-white hover:text-gray-200">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;