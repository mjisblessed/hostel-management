// export const postToBackend = async (link, data) => {
//   try {
//     const token = localStorage.getItem('token'); // Ensure token is retrieved
//     if (!token) {
//       throw new Error('No token found in localStorage');
//     }

//     const response = await axios.post(link, data, {
//       headers: {
//         'Authorization': Bearer ${token},
//         'Content-Type': 'application/json'
//       },
//     });
//     return response; // Return the full Axios response object
//   } catch (error) {
//     console.error('Request Error:', error.response ? error.response.data : error.message);
//     throw error; // Rethrow to allow handling at the calling site
//   }
// };

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postToBackend } from '@/store/fetchdata';
import { loadStripe } from '@stripe/stripe-js';

const Stripe = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || isNaN(amount) || amount <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }
    setError('');

    const paymentData = { amount: parseFloat(amount) };
    console.log('Payment data:', paymentData);

    try {
      // const response = await postToBackend('http://127.0.0.1:5090/api/payments/paynow', paymentData,);

      const token = localStorage.getItem('token'); // Ensure token is retrieved
        if (!token) {
          throw new Error('No token found in localStorage');
        }
    
        const response = await axios.post('http://127.0.0.1:5090/api/payments/paynow', paymentData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

      console.log("post to backend ho gya")
      console.log(response)

      if (!response || !response.data || !response.data.id) {
        console.error('Invalid response from backend:', response);
        alert('Failed to initiate payment. Please try again.');
        return;
      }

      console.log("kuch garbar nahi 1")
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      console.log(stripe);
      console.log("kuch garbar nahi 2");
      console.log(response.data.success);
      if (response.data.success) {
        const result = await stripe.redirectToCheckout({ sessionId: response.data.id });
      }

      if (result?.error) {
        console.error('Error during checkout redirect:', result.error.message);
        alert(`Error: ${result.error.message}`);
      }
    } catch (error) {
      console.error('Error initiating payment:', error.response ? error.response.data : error.message);
      alert('An error occurred while processing your payment. Please try again later.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen mt-8">
      <div className="max-w-3xl bg-white p-8 shadow-lg rounded-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Stripe Payment</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Enter Amount
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-md shadow-md"
          >
            Submit
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default Stripe;

// const Stripe = () => {
//   const [amount, setAmount] = useState('');
//   const navigate = useNavigate();

//   const handlePayment = async () => {
//     try {
//       const response = await postToBackend('http://127.0.0.1:5090/api/payments/paynow', { amount });
//       console.log("post ho gaya")
//       if (response.data.success) {
//         const sessionId = response.data.id;
//         navigate(https://checkout.stripe.com/pay/${sessionId});
//       }
//     } catch (error) {
//       console.error("Error initiating payment:", error);
//       alert('Payment initiation failed!');
//     }
//   };

//   return (
//     <div>
//       <h1>Mess Fee Payment</h1>
//       <input
//         type="number"
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//         placeholder="Enter amount"
//       />
//       <button onClick={handlePayment}>Pay Now</button>
//     </div>
//   );
// };

// export default Stripe;