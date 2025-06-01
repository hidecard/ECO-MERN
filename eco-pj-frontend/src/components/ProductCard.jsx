import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';

function ProductCard({ product }) {
  const { addItem } = useContext(CartContext);

  const handleAddToCart = async () => {
    try {
      await addItem(product._id, 1);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.message || 'Failed to add to cart');
    }
  };

  return (
    <div className="bg-white/90 rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
      <img
        src={product.imageURLs?.[0] || 'https://via.placeholder.com/150'}
        alt={product.name}
        className="w-full h-48 sm:h-56 object-cover rounded-lg mb-4"
        loading="lazy"
      />
      <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">{product.name}</h3>
      <p className="text-lg font-extrabold text-orange-600 mt-2">${product.price.toFixed(2)}</p>
      <button
        onClick={handleAddToCart}
        className="mt-4 w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-xl hover:from-orange-600 hover:to-orange-700 focus:ring-2 focus:ring-orange-500 transition-all duration-300"
        aria-label={`Add ${product.name} to cart`}
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;