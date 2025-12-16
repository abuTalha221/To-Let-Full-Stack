import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const credits = params.get('credits') || null;

    Swal.fire({
      icon: 'success',
      title: 'Payment Successful',
      text: credits ? `You received ${credits} credits.` : 'Thank you for your payment.',
      confirmButtonColor: '#e45716'
    }).then(() => {
      // refresh local user profile to show updated credits
      // reload user from backend or redirect user to dashboard
      navigate('/user-panel');
    });
  }, [location, navigate]);

  return <div className="p-10 text-center">Processing success...</div>;
}

export default PaymentSuccess;
