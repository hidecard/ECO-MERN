import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProduct, getReviews, createReview } from '../lib/api';
import jwt_decode from 'jwt-decode';

function StarRating({ rating, setRating, readOnly = false }) {
  const handleClick = (value) => {
    if (!readOnly && setRating) {
      setRating(value);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-6 h-6 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} ${
            !readOnly ? 'cursor-pointer hover:text-yellow-500 transition-colors duration-200' : ''
          }`}
          fill="currentColor"
          viewBox="0 0 24 24"
          onClick={() => handleClick(star)}
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

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
    <div className="container mx-auto p-8 text-center">
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500"></div>
      </div>
      <p className="mt-4 text-lg text-gray-600">Loading...</p>
    </div>
  );

  if (error) return (
    <div className="container mx-auto p-8 text-center">
      <p className="text-lg text-red-500">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 focus:ring-2 focus:ring-orange-500 transition-all duration-300"
      >
        Try Again
      </button>
    </div>
  );

  if (!product) return (
    <div className="container mx-auto p-8 text-center">
      <p className="text-lg text-red-500">Product not found</p>
      <Link to="/products" className="mt-4 inline-block text-orange-500 hover:text-orange-600 font-semibold">
        Back to Products
      </Link>
    </div>
  );

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-5xl font-extrabold text-orange-600 mb-10">{product.name}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <img
            src={product.imageURLs?.[0] || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-[32rem] object-cover rounded-xl"
            loading="lazy"
            onError={(e) => (e.target.src = '/placeholder.jpg')}
          />
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <p className="text-lg font-extrabold text-orange-600">Price: ${product.price?.toFixed(2)}</p>
            <p className="text-gray-600">Stock: {product.stock}</p>
            <p className="text-gray-600">Category: {product.categoryId?.name || 'Uncategorized'}</p>
            <p className="text-gray-800 mt-4">{product.description}</p>
          </div>
          <button
            onClick={handleAddToCart}
            className="mt-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 focus:ring-2 focus:ring-orange-500 transition-all duration-300"
          >
            Add to Cart
          </button>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold text-orange-600 mb-6">Reviews</h2>
        {reviews.length === 0 ? (
          <div className="text-center py-10 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100">
            <p className="text-lg text-gray-600">No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review._id} className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 p-6 flex items-start hover:shadow-xl transition-all duration-300">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold">
                    {review.userId?.name?.[0] || 'A'}
                  </div>
                </div>
                <div className="ml-4">
                  <StarRating rating={review.rating} readOnly />
                  <p className="text-gray-600 mt-2">{review.comment}</p>
                  <p className="text-gray-500 text-sm">By {review.userId?.name || 'Anonymous'}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmitReview} className="mt-8 bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-gray-100">
          <h3 className="text-xl font-extrabold text-orange-600 mb-4">Write a Review</h3>
          <div className="grid gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Rating</label>
              <StarRating
                rating={reviewForm.rating}
                setRating={(value) => setReviewForm({ ...reviewForm, rating: value })}
              />
            </div>
            <div className="relative">
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                className="peer border rounded-lg p-3 w-full focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                rows="4"
                required
                placeholder=" "
              />
              <label className="absolute top-0 left-3 -translate-y-1/2 bg-white/80 px-1 text-gray-700 text-sm peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 transition-all">
                Comment
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 focus:ring-2 focus:ring-orange-500 transition-all duration-300"
          >
            Submit Review
          </button>
        </form>
      </section>
    </div>
  );
}

export default ProductDetail;