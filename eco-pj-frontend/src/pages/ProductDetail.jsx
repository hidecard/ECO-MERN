import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProduct, getReviews, createReview } from '../lib/api';
import jwt_decode from 'jwt-decode';

function ProductDetail() {
  const { id } = useParams();
  const { token, addItem } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const productData = await getProduct(id);
        console.log('Product data:', productData);
        setProduct(productData);

        console.log('Fetching reviews with ID:', id);
        const reviewsData = await getReviews(id);
        console.log('Reviews data:', reviewsData);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError(error.message || 'Failed to load product or reviews');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('Please log in to submit a review');
      navigate('/login');
      return;
    }
    try {
      const decoded = jwt_decode(token);
      const reviewData = {
        productId: id,
        userId: decoded.id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      };
      console.log('Submitting review:', reviewData);
      const newReview = await createReview(token, reviewData);
      setReviews([...reviews, newReview]);
      setReviewForm({ rating: 0, comment: '' });
      alert('Review submitted successfully');
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert(error.message || 'Failed to submit review');
    }
  };

  const handleAddToCart = async () => {
    if (!token) {
      alert('Please log in to add to cart');
      navigate('/login');
      return;
    }
    try {
      await addItem(id, 1);
      alert('Added to cart');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert(error.message || 'Failed to add to cart');
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
      <button
        onClick={() => window.location.reload()}
        className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
      >
        Try Again
      </button>
    </div>
  );

  if (!product) return (
    <div className="container mx-auto p-4 text-center text-red-500">
      Product not found
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">{product.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <img
            src={product.imageURLs?.[0] || '/placeholder.jpg'}
            alt={product.name}
            className="w-full rounded-lg"
            onError={(e) => (e.target.src = '/placeholder.jpg')}
          />
        </div>
        <div>
          <p className="text-gray-600">Price: ${product.price?.toFixed(2)}</p>
          <p className="text-gray-600">Stock: {product.stock}</p>
          <p className="text-gray-600">Category: {product.categoryId?.name || 'Uncategorized'}</p>
          <p className="text-gray-800 mt-4">{product.description}</p>
          <button
            onClick={handleAddToCart}
            className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
          >
            Add to Cart
          </button>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold text-orange-600 mb-4">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-600">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review._id} className="bg-white rounded-lg shadow-md p-4">
                <p className="text-gray-800">Rating: {review.rating}/5</p>
                <p className="text-gray-600">{review.comment}</p>
                <p className="text-gray-500 text-sm">By User {review.userId?.name || 'Anonymous'}</p>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmitReview} className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-orange-600 mb-4">Write a Review</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Rating (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              value={reviewForm.rating}
              onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
              className="border rounded-lg p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Comment</label>
            <textarea
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              className="border rounded-lg p-2 w-full"
              rows="4"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
          >
            Submit Review
          </button>
        </form>
      </section>
    </div>
  );
}

export default ProductDetail;