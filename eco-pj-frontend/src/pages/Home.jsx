import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../lib/api';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="container mx-auto p-4 text-center">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">Welcome to YHA Shop</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <p className="text-gray-600">No products available.</p>
        ) : (
          products.map(product => (
            <Link
              to={`/products/${product._id}`}
              key={product._id}
              className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition bg-white"
            >
              <img
                src={product.imageURLs[0] || 'https://via.placeholder.com/300'}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
                <p className="text-gray-600">${product.price.toFixed(2)}</p>
                {product.categoryId && (
                  <p className="text-sm text-gray-500">Category: {product.categoryId.name}</p>
                )}
                <button className="mt-2 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                  View Details
                </button>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;