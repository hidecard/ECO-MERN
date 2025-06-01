import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getWishlist, removeFromWishlist, addToCart } from '../lib/api';
import { toast } from 'react-toastify';

function Wishlist() {
  const { token } = useCart();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        navigate('/login');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const wishlistData = await getWishlist(token);
        setWishlist(wishlistData);
      } catch (error) {
        setError(error.message || 'Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, navigate]);

  const handleRemove = async (productId) => {
    setLoading(true);
    try {
      const updatedWishlist = await removeFromWishlist(token, productId);
      setWishlist(updatedWishlist);
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error(error.message || 'Failed to remove from wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(token, productId, 1);
      toast.success('Added to cart');
    } catch (error) {
      toast.error(error.message || 'Failed to add to cart');
    }
  };

  if (!token) return null;

  if (loading) return (
    <div className="container mx-auto p-4 text-center">
      <svg className="animate-spin h-8 w-8 text-orange-600 mx-auto" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
      </svg>
      <p className="mt-2 text-gray-600">Loading...</p>
    </div>
  );

  if (error) return (
    <div className="container mx-auto p-4 text-center text-red-500">
      <p className="text-lg font-semibold">{error}</p>
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
      <h1 className="text-3xl font-bold text-orange-600 mb-6">Your Wishlist</h1>
      {wishlist?.items.length === 0 ? (
        <p className="text-gray-600">Your wishlist is empty.</p>
      ) : (
        <div className="space-y-4">
          {wishlist.items.map(product => (
            <div key={product._id} className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center">
                <img
                  src={product.imageURLs?.[0] || 'https://via.placeholder.com/100'}
                  alt={product.name}
                  className="w-20 h-20 rounded-lg mr-4"
                />
                <div>
                  <p className="text-gray-800 font-medium">{product.name}</p>
                  <p className="text-gray-600">${product.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleAddToCart(product._id)}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  disabled={loading}
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleRemove(product._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  disabled={loading}
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