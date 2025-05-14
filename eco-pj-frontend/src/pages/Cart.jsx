import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

function Cart() {
  const { cart, updateItem, removeItem } = useCart();

  if (!cart) return <div>Loading...</div>;

  const total = cart.items.reduce((sum, item) => sum + item.quantity * item.productId.price, 0);

  return (
    <div>
      <h1>Your Cart</h1>
      {cart.items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cart.items.map(item => (
            <div key={item.productId._id}>
              <h3>{item.productId.name}</h3>
              <p>Price: ${item.productId.price}</p>
              <p>Quantity: {item.quantity}</p>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateItem(item.productId._id, Number(e.target.value))}
              />
              <button onClick={() => removeItem(item.productId._id)}>Remove</button>
            </div>
          ))}
          <h2>Total: ${total.toFixed(2)}</h2>
          <Link to="/checkout">Proceed to Checkout</Link>
        </>
      )}
    </div>
  );
}

export default Cart;