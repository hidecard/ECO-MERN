import { useState, useEffect } from 'react';
import { getWishlist, removeFromWishlist } from '../lib/api';

function Wishlist() {
  const [wishlist, setWishlist] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await getWishlist(token);
        setWishlist(data);
      } catch (error) {
        console.error('Failed to fetch wishlist:', error);
      }
    };
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const updatedWishlist = await removeFromWishlist(token, productId);
      setWishlist(updatedWishlist);
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  if (!wishlist) return <div>Loading...</div>;

  return (
    <div>
      <h1>Your Wishlist</h1>
      {wishlist.productIds.length === 0 ? (
        <p>Your wishlist is empty</p>
      ) : (
        wishlist.productIds.map(product => (
          <div key={product._id}>
            <h3>{product.name}</h3>
            <p>Price: ${product.price}</p>
            <button onClick={() => handleRemove(product._id)}>Remove</button>
          </div>
        ))
      )}
    </div>
  );
}

export default Wishlist;