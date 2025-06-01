import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaHome, FaBox, FaShoppingCart, FaUsers, FaList, FaSignOutAlt } from 'react-icons/fa';

function Sidebar() {
  const { token, setToken } = useCart();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: <FaHome className="mr-3 text-lg" /> },
    { path: '/admin/products', label: 'Products', icon: <FaBox className="mr-3 text-lg" /> },
    { path: '/admin/orders', label: 'Orders', icon: <FaShoppingCart className="mr-3 text-lg" /> },
    { path: '/admin/users', label: 'Users', icon: <FaUsers className="mr-3 text-lg" /> },
    { path: '/admin/categories', label: 'Categories', icon: <FaList className="mr-3 text-lg" /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    window.location.href = '/login';
  };

  if (!token) return null;

  return (
    <>
      <button
        className="md:hidden fixed top-20 left-4 z-50 bg-orange-600 text-white p-3 rounded-full shadow-lg hover:bg-orange-700 transition-colors"
        onClick={toggleSidebar}
        aria-label={isOpen ? 'Close Sidebar' : 'Open Sidebar'}
      >
        {isOpen ? '✕' : '☰'}
      </button>

      <div
        className={`fixed top-0 left-0 h-full bg-orange-600 text-white w-64 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:w-64 z-40 pt-16 md:pt-0 border-r border-orange-700/30`}
      >
        <div className="p-6 border-b border-orange-700/30">
          <h2 className="text-2xl font-bold text-center text-white">YHA Shop Admin</h2>
        </div>
        <nav className="mt-4 flex flex-col h-full">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-4 hover:bg-orange-700/80 transition-colors duration-200 ${
                location.pathname === item.path ? 'bg-orange-700 text-white' : 'text-orange-100'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center p-4 mt-auto text-orange-100 hover:bg-orange-700/80 transition-colors duration-200"
          >
            <FaSignOutAlt className="mr-3 text-lg" />
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}

export default Sidebar;