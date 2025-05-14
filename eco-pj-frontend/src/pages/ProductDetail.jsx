import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct, getReviews, createReview } from '../lib/api';
import { useCart } from '../context/CartContext';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');
  const { addItem } = useCart();

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
      await addItem(product._id, 1);
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

  if (!product) return <div className="container mx-auto p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <p className="text-xl text-gray-600 mb-2">Price: ${product.price}</p>
      <p className="text-gray-700 mb-4">{product.description}</p>
      {product.categoryId && (
        <p className="text-sm text-gray-500 mb-4">Category: {product.categoryId.name}</p>
      )}
      <button
        onClick={handleAddToCart}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6"
      >
        Add to Cart
      </button>
      <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-600">No reviews yet.</p>
      ) : (
        reviews.map(review => (
          <div key={review._id} className="border p-4 rounded-lg mb-4">
            <p className="text-yellow-500">Rating: {'★'.repeat(review.rating)}</p>
            <p className="text-gray-700">{review.comment}</p>
            <p className="text-sm text-gray-500">By: {review.userId.name}</p>
          </div>
        ))
      )}
      <form onSubmit={handleSubmitReview} className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Write a Review</h3>
        <label className="block mb-2">
          Rating:
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border rounded p-2 w-full"
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
            className="border rounded p-2 w-full"
          />
        </label>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
}

export default ProductDetails;