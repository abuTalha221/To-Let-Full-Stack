import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../../api'; // adjust path if needed
import Swal from 'sweetalert2';

export default function PaymentProcessing() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const txId = params.get('transaction_id');

    let attempts = 0;
    const maxAttempts = 20; // poll up to ~100s
    const interval = 5000;

    const pollTx = async () => {
      attempts++;
      try {
        const res = await api.get(`/transactions/${txId}`);
        if (res?.data?.status && res.data.transaction) {
          const t = res.data.transaction;
          if (t.status === 'success') {
            Swal.fire({ icon: 'success', title: 'Payment verified', text: `Credits added: ${t.credits}` });
            navigate(`/payment-success?credits=${t.credits}`, { replace: true });
            return;
          }

          if (t.status === 'failed') {
            Swal.fire({ icon: 'error', title: 'Payment failed', text: 'The transaction failed. You can retry.' });
            navigate('/payment-failed', { replace: true });
            return;
          }
        }
      } catch (err) {
        console.warn('Polling error', err);
      }

      if (attempts >= maxAttempts) {
        Swal.fire({ icon: 'info', title: 'Still processing', text: 'We are still verifying your payment. Check Transactions later.' });
        navigate('/user-panel', { replace: true });
        return;
      }

      setTimeout(pollTx, interval);
    };

    // If txId provided, poll transaction status; otherwise fallback to old behavior
    if (txId) {
      pollTx();
    } else {
      // fallback: naive credits check
      let attempts2 = 0;
      const pollCredits = async () => {
        attempts2++;
        try {
          const res = await api.get('/credits');
          if (res?.data?.credits) {
            Swal.fire({ icon: 'success', title: 'Payment verified', text: 'Credits added.' });
            navigate('/payment-success', { replace: true });
            return;
          }
        } catch (err) {
          console.warn('Polling error', err);
        }

        if (attempts2 >= maxAttempts) {
          Swal.fire({ icon: 'info', title: 'Still processing', text: 'We are still verifying your payment. Check Transactions later.' });
          navigate('/user-panel', { replace: true });
          return;
        }

        setTimeout(pollCredits, interval);
      };

      pollCredits();
    }
  }, [navigate, location]);

  return (
    <div className="p-10 text-center">
      <h2 className="text-xl font-semibold">Processing payment…</h2>
      <p>Please wait — we are verifying your payment. You will be redirected when complete.</p>
    </div>
  );
}
