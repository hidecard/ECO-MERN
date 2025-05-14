import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cart, updateItem, removeItem } = useCart();

  const total = cart?.items?.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  ) || 0;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">Your Cart</h1>
      {cart?.items?.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.items.map(item => (
            <div key={item.productId._id} className="flex items-center border rounded-lg p-4 bg-white">
              <img
                src={item.productId.imageURLs[0] || 'https://via.placeholder.com/100'}
                alt={item.productId.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="ml-4 flex-1">
                <h3 className="text-xl font-semibold text-gray-800">{item.productId.name}</h3>
                <p className="text-gray-600">${item.productId.price.toFixed(2)}</p>
                <div className="flex items-center mt-2">
                  <label className="mr-2">Qty:</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.productId._id, Number(e.target.value))}
                    className="border rounded w-16 p-1"
                  />
                  <button
                    onClick={() => removeItem(item.productId._id)}
                    className="ml-4 text-orange-500 hover:text-orange-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-800">Total: ${total.toFixed(2)}</h2>
            <Link
              to="/checkout"
              className="inline-block mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;