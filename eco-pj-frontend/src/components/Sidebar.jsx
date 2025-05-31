import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Sidebar() {
  const { token, setToken } = useCart();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: '' },
    { path: '/admin/products', label: 'Products', icon: '' },
    { path: '/admin/orders', label: 'Orders', icon: '' },
    { path: '/admin/users', label: 'Users', icon: '' },
    { path: '/admin/categories', label: 'Categories', icon: '' },
  ];

  if (!token) return null;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-20 left-4 z-50 bg-orange-500 text-white p-2 rounded-lg"
        onClick={toggleSidebar}
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-orange-600 text-white w-64 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:w-64 z-40 pt-16 md:pt-0`}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold text-center">YHA Shop Admin</h2>
        </div>
        <nav className="mt-4">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-4 hover:bg-orange-700 ${
                location.pathname === item.path ? 'bg-orange-700' : ''
              }`}
              onClick={() => setIsOpen(false)}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          {/* <div className="p-4">
            <button
              onClick={() => {
                localStorage.removeItem('token');
                setToken(null);
                window.location.href = '/login';
              }}
              className="w-full text-left p-4 hover:bg-orange-700"
            >
               Logout
            </button>
          </div> */}
        </nav>
      </div>

      {/* Overlay for mobile */}
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