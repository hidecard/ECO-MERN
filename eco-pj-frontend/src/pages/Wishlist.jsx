import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

function Wishlist() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { wishlist, addItem, removeFromWishlist } = useCart();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setError('Please log in to view wishlist');
      setLoading(false);
      return;
    }
    setLoading(false);
  }, [user]);

  const handleAddToCart = async (productId) => {
    if (!user) {
      toast.error('Please log in to add to cart');
      navigate('/login');
      return;
    }
    try {
      await addItem(productId, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error(error.message || 'Failed to add to cart');
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await removeFromWishlist(productId);
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      toast.error(error.message || 'Failed to remove from wishlist');
    }
  };

  if (loading) return (
    <div className="container mx-auto p-8 text-center">
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500"></div>
      </div>
      <p className="mt-4 text-xl text-gray-600">Loading wishlist...</p>
    </div>
  );

  if (error) return (
    <div className="container mx-auto p-8 text-center">
      <p className="text-lg text-red-500">{error}</p>
      <Link to="/" className="mt-4 inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 focus:ring-2 focus:ring-orange-500 transition-all duration-300">
        Browse Products
      </Link>
    </div>
  );

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-5xl font-extrabold text-orange-600 mb-10">Your Wishlist</h1>
      {wishlist.length === 0 ? (
        <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 0 4.5 4.5 0 010 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
          </svg>
          <p className="mt-4 text-xl text-gray-600">Your wishlist is empty.</p>
          <Link to="/" className="mt-4 inline-block text-orange-500 hover:text-orange-600 font-semibold">
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlist.map(product => (
            <div key={product._id} className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <img
                src={product.imageURLs?.[0] || 'https://via.placeholder.com/150'}
                alt={product.name}
                className="w-full h-56 object-cover rounded-lg mb-4"
                loading="lazy"
              />
              <h3 className="text-xl font-bold text-gray-800 truncate">{product.name}</h3>
              <p className="text-lg font-extrabold text-orange-600 mt-2">${product.price.toFixed(2)}</p>
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => handleAddToCart(product._id)}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleRemoveFromWishlist(product._id)}
                  className="flex-1 bg-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;