import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

function Cart() {
  const { cart, updateItem, removeItem } = useContext(CartContext);

  const total = cart.items.reduce((sum, item) => sum + item.quantity * item.productId.price, 0);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.items.map((item) => (
            <div key={item.productId._id} className="flex items-center border p-4 rounded-md">
              <img
                src={item.productId.imageURLs[0] || 'https://via.placeholder.com/100'}
                alt={item.productId.name}
                className="w-24 h-24 object-cover rounded-md mr-4"
              />
              <div className="flex-grow">
                <h3 className="text-lg font-medium">{item.productId.name}</h3>
                <p className="text-gray-600">${item.productId.price.toFixed(2)}</p>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => updateItem(item.productId._id, item.quantity - 1)}
                    className="px-2 py-1 bg-gray-200 rounded-md"
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    onClick={() => updateItem(item.productId._id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-200 rounded-md"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.productId._id)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="text-right">
            <p className="text-xl font-semibold">Total: ${total.toFixed(2)}</p>
            <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;