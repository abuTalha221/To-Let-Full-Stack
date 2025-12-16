import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const PaymentFailed = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const reason = params.get('reason') || null;

    Swal.fire({
      icon: 'error',
      title: 'Payment Failed',
      text: reason ? decodeURIComponent(reason) : 'Payment failed or cancelled.',
      confirmButtonColor: '#e45716'
    }).then(() => navigate('/user-panel'));
  }, [navigate, location]);

  return <div className="p-10 text-center">Processing failure...</div>;
}

export default PaymentFailed;
