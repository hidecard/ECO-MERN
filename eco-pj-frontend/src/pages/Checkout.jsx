import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createOrder } from '../lib/api';
import { useCart } from '../context/CartContext';

const stripePromise = loadStripe('pk_test_your_stripe_publishable_key'); // Replace with your Stripe publishable key

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { cart } = useCart();
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !cart) return;

    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const cardElement = elements.getElement(CardElement);
      const { paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      const orderData = {
        shippingInfo,
        paymentMethod: paymentMethod.id,
      };

      await createOrder(token, orderData);
      alert('Order placed successfully!');
      window.location.href = '/orders';
    } catch (error) {
      setError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Shipping Information</h2>
      <input
        type="text"
        placeholder="Address"
        value={shippingInfo.address}
        onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="City"
        value={shippingInfo.city}
        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Postal Code"
        value={shippingInfo.postalCode}
        onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Country"
        value={shippingInfo.country}
        onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
        required
      />
      <h2>Payment Information</h2>
      <CardElement />
      {error && <div>{error}</div>}
      <button type="submit" disabled={!stripe || processing}>
        {processing ? 'Processing...' : 'Place Order'}
      </button>
    </form>
  );
}

function Checkout() {
  return (
    <div>
      <h1>Checkout</h1>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}

export default Checkout;