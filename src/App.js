import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import "bootswatch/dist/lux/bootstrap.min.css";
import axios from 'axios';

import './App.css';

const stripePromise = loadStripe("pk_test_51M2m6uDLYESPPfVdUO58dq0fV9gZ5HbKTDWzsBZ3BGLKEOZDcU7RJvxovMdT2f32eqj9eNnMuM6T4SnceGkkdWSb00twEoEpcR")

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)
    }).then(async ({ paymentMethod }) => {
      const { id } = paymentMethod;

      await axios.post('http://localhost:4000/api/checkout', {
        id,
        amount: 1000
      }).then(res => {
        console.log(res.data);

        elements.getElement(CardElement).clear();
      });
    }).catch((error) => {
      console.log(error);
    });

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="card card-body">

      <img src="https://d34vmoxq6ylzee.cloudfront.net/catalog/product/cache/b3b166914d87ce343d4dc5ec5117b502/5/6/56R64AA-1_T1662674291.png" alt="Teclado Mecánico" className='img-fluid' />

      <h3 className='text-center'>Price: $ 100</h3>

      <CardElement className='form-control mb-3' />
      <button className='btn btn-success' disabled={!stripe}>
        {loading ? (
          <div className="spinner-border text-light" role="status">
            <span className="sr-only"></span>
          </div>
        ) : (
          'Buy'
        )}
      </button>
    </form>
  );
};

function App() {
  return (
    <Elements stripe={stripePromise}>
      <div className="container p-4">
        <div className="row">
          <div className="col-md-4 offset-md-4">
            <CheckoutForm />
          </div>
        </div>
      </div>
    </Elements>
  );
}

export default App;
