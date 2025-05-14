import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct, getReviews, createReview } from '../lib/api';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');
  const { cart, setCart } = useContext(CartContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productData = await getProduct(id);
        const reviewsData = await getReviews(id);
        setProduct(productData);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Failed to fetch product or reviews:', error);
      }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const updatedCart = await addToCart(token, product._id, 1);
      setCart(updatedCart);
      alert('Added to cart');
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await createReview(token, { productId: id, rating, comment });
      const reviewsData = await getReviews(id);
      setReviews(reviewsData);
      setRating(1);
      setComment('');
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  if (!product) return <div className="container mx-auto p-4 text-center">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-lg shadow-md p-6">
        <img
          src={product.imageURLs[0] || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="w-full h-64 object-cover rounded-lg"
        />
        <div>
          <h1 className="text-3xl font-bold text-orange-600 mb-4">{product.name}</h1>
          <p className="text-2xl text-gray-800 mb-2">${product.price.toFixed(2)}</p>
          <p className="text-gray-600 mb-4">{product.description}</p>
          {product.categoryId && (
            <p className="text-sm text-gray-500 mb-4">Category: {product.categoryId.name}</p>
          )}
          <button
            onClick={handleAddToCart}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
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
              <p className="text-sm text-gray-500">By: {review.userId.name}</p>
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
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProductDetails;