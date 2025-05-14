import { useState, useEffect } from 'react';
import { getProducts } from '../lib/api';
import ProductCard from '../components/ProductCard';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      {/* Hero Section */}
      <div className="bg-blue-100 rounded-lg p-8 mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to ECO PJ</h1>
        <p className="text-lg mb-4">Discover the best products at unbeatable prices!</p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
          Shop Now
        </button>
      </div>

      {/* Product Grid */}
      <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;