import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct, getReviews, createReview, addToCart } from '../lib/api';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cart, setCart, token } = useContext(CartContext);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching product with ID:', id);
        const productData = await getProduct(id);
        console.log('Product data:', productData);
        setProduct(productData);

        console.log('Fetching reviews with ID:', id);
        try {
          const reviewsData = await getReviews(id);
          console.log('Reviews data:', reviewsData);
          setReviews(reviewsData);
        } catch (reviewError) {
          console.warn('No reviews found for product:', reviewError.message);
          setReviews([]);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setError(error.message || 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchData();
    } else {
      setError('Invalid product ID');
      setLoading(false);
    }
  }, [id]);

  const handleAddToCart = async () => {
    try {
      if (!token) throw new Error('Please log in to add items to cart');
      console.log('Adding to cart: productId=', product._id, 'token=', token.slice(0, 10) + '...'); // Debug
      const updatedCart = await addToCart(token, product._id, 1);
      console.log('Updated cart:', updatedCart); // Debug
      setCart(updatedCart);
      alert('Added to cart');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert(error.message || 'Failed to add to cart');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      if (!token) throw new Error('Please log in to submit a review');
      console.log('Submitting review:', { productId: id, rating, comment }); // Debug
      await createReview(token, { productId: id, rating, comment });
      const reviewsData = await getReviews(id);
      setReviews(reviewsData);
      setRating(1);
      setComment('');
      alert('Review submitted');
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert(error.message || 'Failed to submit review');
    }
  };

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
      {error}
      <Link to="/products" className="block mt-4 text-orange-500 hover:text-orange-600">
        Back to Shop
      </Link>
    </div>
  );
  if (!product) return <div className="container mx-auto p-4 text-center">Product not found</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-lg shadow-md p-6">
        <img
          src={product.imageURLs?.[0] || 'https://via.placeholder.com/300'}
          alt={product.name || 'Product'}
          className="w-full h-64 object-cover rounded-lg"
        />
        <div>
          <h1 className="text-3xl font-bold text-orange-600 mb-4">{product.name || 'N/A'}</h1>
          <p className="text-2xl text-gray-800 mb-2">${product.price?.toFixed(2) || '0.00'}</p>
          <p className="text-gray-600 mb-4">{product.description || 'No description available'}</p>
          {product.categoryId && (
            <p className="text-sm text-gray-500 mb-4">Category: {product.categoryId.name}</p>
          )}
          <button
            onClick={handleAddToCart}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
            disabled={!product || !token}
          >
            Add to Cart
          </button>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-orange-600 mb-4">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-600">No reviews yet.</p>
        ) : (
          reviews.map(review => (
            <div key={review._id} className="border-b py-4">
              <p className="text-yellow-500">{'★'.repeat(review.rating)}</p>
              <p className="text-gray-700">{review.comment}</p>
              <p className="text-sm text-gray-500">By: {review.userId?.name || 'Anonymous'}</p>
            </div>
          ))
        )}
        <form onSubmit={handleSubmitReview} className="mt-6">
          <h3 className="text-xl font-semibold text-orange-600 mb-2">Write a Review</h3>
          <label className="block mb-2">
            Rating:
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border rounded-lg p-2 w-full"
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </label>
          <label className="block mb-2">
            Comment:
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="border rounded-lg p-2 w-full"
            />
          </label>
          <button
            type="submit"
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
            disabled={!token}
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProductDetails;