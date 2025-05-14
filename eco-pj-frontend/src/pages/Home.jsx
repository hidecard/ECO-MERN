import { useState, useEffect } from 'react';
import { getProducts } from '../lib/api';

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Products</h1>
      <div>
        {products.map(product => (
          <div key={product._id}>
            <h3>{product.name}</h3>
            <p>Price: ${product.price}</p>
            <a href={`/products/${product._id}`}>View Details</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;