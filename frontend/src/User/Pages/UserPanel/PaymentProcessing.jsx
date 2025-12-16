import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api'; // adjust path if needed
import Swal from 'sweetalert2';

export default function PaymentProcessing() {
  const navigate = useNavigate();

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 12; // poll up to ~60s
    const interval = 5000;

    const poll = async () => {
      attempts++;
      try {
        // adjust endpoint to where you can read user's recent transactions
        const res = await api.get('/credits'); // or '/transactions' if you have that
        // If your GET /credits returns user's credit count, you might want to refresh user profile instead.
        // Here we expect your backend has an endpoint to list transactions; adapt as needed.
        const data = res.data;
        // naive check: if credits increased or some flag, redirect to success
        // Adjust this logic to your API shape:
        if (data && data.credits) {
          // You may want to perform better detection; this is a simple example:
          Swal.fire({ icon: 'success', title: 'Payment verified', text: 'Credits added.' });
          navigate('/payment-success', { replace: true });
          return;
        }
      } catch (err) {
        console.warn('Polling error', err);
      }
      if (attempts >= maxAttempts) {
        Swal.fire({ icon: 'info', title: 'Still processing', text: 'We are still verifying your payment. Check Transactions later.' });
        navigate('/user-panel', { replace: true });
        return;
      }
      setTimeout(poll, interval);
    };

    poll();
  }, [navigate]);

  return (
    <div className="p-10 text-center">
      <h2 className="text-xl font-semibold">Processing payment…</h2>
      <p>Please wait — we are verifying your payment. You will be redirected when complete.</p>
    </div>
  );
}
