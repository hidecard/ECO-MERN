import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../lib/api';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products from:', 'http://localhost:5000/api/products');
        const data = await getProducts();
        console.log('Products data:', data);
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setError(error.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return (
    <div className="container mx-auto p-4 text-center">
      <svg className="animate-spin h-8 w-8 text-orange-600 mx-auto" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
      </svg>
      <p className="mt-2 text-gray-600">Loading products...</p>
    </div>
  );

  if (error) return (
    <div className="container mx-auto p-4 text-center text-red-500">
      {error}
      <p className="mt-2">
        <Link to="/products" className="text-orange-500 hover:text-orange-600">
          Try again
        </Link>
      </p>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-orange-600 mb-6 text-center">Welcome to YHA Shop</h1>
      {products.length === 0 ? (
        <p className="text-center text-gray-600">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product._id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
              <img
                src={product.imageURLs?.[0] || 'https://via.placeholder.com/150'}
                alt={product.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
              <p className="text-gray-600 mb-2">{product.categoryId?.name || 'Uncategorized'}</p>
              <p className="text-lg text-orange-600 mb-4">${product.price.toFixed(2)}</p>
              <Link
                to={`/products/${product._id}`}
                className="block text-center bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;