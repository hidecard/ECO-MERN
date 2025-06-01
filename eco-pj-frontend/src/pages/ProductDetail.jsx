import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProduct, getReviews, createReview } from '../lib/api';
import { toast } from 'react-toastify';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productData, reviewsData] = await Promise.all([
          getProduct(id),
          getReviews(id),
        ]);
        setProduct(productData);
        setReviews(reviewsData);
      } catch (error) {
        setError(error.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = async () => {
    if (!token) {
      toast.error('Please log in to add to cart');
      return;
    }
    try {
      await addItem(id, 1);
      toast.success('Added to cart');
    } catch (error) {
      toast.error(error.message || 'Failed to add to cart');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Please log in to submit a review');
      return;
    }
    try {
      const newReview = await createReview(token, { productId: id, ...reviewForm });
      setReviews([...reviews, newReview]);
      setReviewForm({ rating: 5, comment: '' });
      toast.success('Review submitted');
    } catch (error) {
      toast.error(error.message || 'Failed to submit review');
    }
  };

  if (loading) return (
    <div className="container mx-auto p-4 text-center">
      <svg className="animate-spin h-8 w-8 text-orange-600 mx-auto" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" className="opacity-25" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8 v-8h8v8 8a8 8 0 01-8 8 8 8 0 01-8-8z" />
      </svg>
      <p className="mt-2 text-gray-600">Loading...</p>
    </div>
  );

  if (error) return (
    <div className="container mx-auto p-4 text-center text-red-500">
      <p className="text-lg font-semibold">{error}</p>
      <button
        onClick={() => navigate('/')}
        className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
      >
        Back to Home
      </button>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <img
              src={product.imageURLs?.[0] || 'https://via.placeholder.com/300'}
              alt={product.name}
              className="w-full rounded-lg"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-orange-600 mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-2">Category: {product.categoryId?.name || 'Uncategorized'}</p>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <p className="text-2xl font-bold text-orange-600 mb-2">${product.price.toFixed(2)}</p>
            <p className="text-gray-600 mb-4">Stock: {product.stock}</p>
            <button
              onClick={handleAddToCart}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-orange-600 mb-4">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-600">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review._id} className="border-b pb-2">
                <p className="text-gray-800 font-medium">{review.userId?.name || 'Anonymous'}</p>
                <p className="text-yellow-500">{'★'.repeat(review.rating)}</p>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        <h3 className="text-xl font-semibold text-orange-600 mt-6 mb-2">Write a Review</h3>
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Rating</label>
            <select
              value={reviewForm.rating}
              onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
              className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num} Stars</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Comment</label>
            <textarea
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button
            type="submit"
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProductDetail;