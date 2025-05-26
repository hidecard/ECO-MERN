import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProducts } from '../lib/api';

function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItem, token } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products from:', 'http://localhost:5000/api/products');
        const data = await getProducts();
        console.log('Products data:', data);
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setError(error.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    setFilteredProducts(
      products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, products]);

  const handleAddToCart = async (productId) => {
    if (!token) {
      alert('Please log in to add to cart');
      return;
    }
    try {
      await addItem(productId, 1);
      // Assuming toast notification is used
      // toast.success('Added to cart!');
      alert('Added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert(error.message || 'Failed to add to cart');
    }
  };

  if (loading) return (
    <div className="container mx-auto p-8 text-center">
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500"></div>
      </div>
      <p className="mt-4 text-lg text-gray-600">Loading products...</p>
    </div>
  );

  if (error) return (
    <div className="container mx-auto p-8 text-center">
      <p className="text-lg text-red-500">{error}</p>
      <Link to="/products" className="mt-4 inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 focus:ring-2 focus:ring-orange-500 transition-all duration-300">
        Try Again
      </Link>
    </div>
  );

  return (
    <div className="container mx-auto p-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-12 mb-12 text-center">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight">Welcome to YHA Shop</h1>
        <p className="text-xl">Discover the best products at unbeatable prices!</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full p-3 rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-orange-500 transition-all duration-300"
            aria-label="Search products"
          />
          <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18M3 3l2 18h14l2-18H3zm5 7h8" />
          </svg>
          <p className="mt-4 text-xl text-gray-600">No products found.</p>
          <Link to="/products" className="mt-4 inline-block text-orange-500 hover:text-orange-600 font-semibold">
            Browse Categories
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <div key={product._id} className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <img
                src={product.imageURLs?.[0] || 'https://via.placeholder.com/150'}
                alt={product.name}
                className="w-full h-56 object-cover rounded-lg mb-4"
                loading="lazy"
              />
              <h2 className="text-xl font-bold text-gray-800 truncate">{product.name}</h2>
              <p className="text-gray-500 text-sm">{product.categoryId?.name || 'Uncategorized'}</p>
              <p className="text-lg font-extrabold text-orange-600 mt-2">${product.price.toFixed(2)}</p>
              <div className="flex space-x-4 mt-4">
                <Link
                  to={`/products/${product._id}`}
                  className="flex-1 text-center bg-gray-200 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-300 focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleAddToCart(product._id)}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-xl hover:from-orange-600 hover:to-orange-700 focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;