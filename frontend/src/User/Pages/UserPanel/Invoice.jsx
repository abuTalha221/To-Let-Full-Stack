import React, { useRef, useEffect } from "react";
import { FaTimes, FaPrint } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Logo from "../../../assets/logo.png";

const Invoice = ({ order, isOpen, onClose }) => {
  const invoiceRef = useRef(null);
  const navigate = useNavigate();

  if (!isOpen || !order) return null;

  // ✅ Auto filename for browser save
  useEffect(() => {
    const oldTitle = document.title;
    document.title = `Invoice-Order-${order.id}`;
    return () => {
      document.title = oldTitle;
    };
  }, [order.id]);

  const handlePrint = () => {
    window.print();
  };

  // ✅ Redirect to orders page on close
  const handleClose = () => {
    onClose?.();
    navigate("/user/orders");
    // reload after navigation
  setTimeout(() => {
    window.location.reload();
  }, 100);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const paymentBadgeColor = {
    paid: "bg-green-100 text-green-800",
    unpaid: "bg-red-100 text-red-800",
    failed: "bg-orange-100 text-orange-800",
  };

  const payable = order.cost || order.budget;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 print-overlay">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-screen overflow-y-auto shadow-2xl print-container">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between print-hide">
          <div className="flex items-center justify-between w-full">
            <img src={Logo} alt="To-Let" className="w-28 h-auto" />

            <div className="text-right mr-5">
              <h3 className="text-3xl font-extrabold text-[#EC733B]">
                INVOICE
              </h3>
              <p className="text-sm text-gray-600">
                Order ID: #{order.id}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="sticky top-20 bg-gray-50 border-b border-gray-200 p-4 flex gap-3 print-hide">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg font-semibold transition"
          >
            <FaPrint /> Print
          </button>
        </div>

        {/* Invoice Content */}
        <div ref={invoiceRef} className="p-8 bg-white relative">

          {/* ✅ Watermark (PAID / UNPAID) */}
          <div className="print-watermark">
            {order.payment_status === "paid" ? "PAID" : "UNPAID"}
          </div>

          {/* Top section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-start">
            <div>
              <h4 className="text-sm font-bold text-gray-600 uppercase">
                Bill To
              </h4>
              <p className="mt-2 text-sm text-gray-700">
                <strong>{order.contact_name || "Customer"}</strong>
                <br />
                {order.contact_phone}
                <br />
                {order.contact_email}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-600 uppercase">
                Order Details
              </h4>
              <div className="mt-2 text-sm text-gray-700">
                <p><strong>Location:</strong> {order.area}, {order.district}</p>
                <p><strong>Room:</strong> {order.room} Room</p>
                <p><strong>Package:</strong> {order.package_code || "standard"}</p>
                <p><strong>Created:</strong> {formatDate(order.created_at)}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 items-end">
              <div className="bg-gray-50 p-4 rounded-lg w-full md:w-44 text-right">
                <div className="text-sm text-gray-600">User Budget</div>
                <div className="font-semibold text-gray-800">
                  {order.budget} BDT
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-inner border border-gray-100 w-full md:w-44 text-right mt-2">
                <div className="text-sm text-gray-600">Payable</div>
                <div className="text-2xl font-extrabold text-[#EC733B]">
                  {payable} BDT
                </div>
              </div>

              <div
                className={`mt-2 inline-block text-xs px-3 py-1 rounded-full ${
                  paymentBadgeColor[order.payment_status] ||
                  "bg-gray-100 text-gray-800"
                }`}
              >
                {order.payment_status}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-6">
            <table className="w-full">
              <thead>
                <tr className="border-t-2 border-b-2 border-gray-300">
                  <th className="text-left py-3 text-sm font-bold text-gray-700">
                    Description
                  </th>
                  <th className="text-right py-3 text-sm font-bold text-gray-700">
                    Amount (BDT)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-3 text-sm text-gray-700">
                    Order Placement Fee
                  </td>
                  <td className="text-right py-3 text-sm text-gray-700">
                    {payable}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Transactions (UNCHANGED) */}
          <div className="mb-6">
            <h4 className="text-sm font-bold text-gray-600 uppercase mb-3">
              Transaction History
            </h4>

            {order.transactions && order.transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-600">
                      <th className="py-2">Transaction ID</th>
                      <th className="py-2 text-right">Amount</th>
                      <th className="py-2">Gateway</th>
                      <th className="py-2">Status</th>
                      <th className="py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.transactions.map((t) => (
                      <tr key={t.id} className="border-t">
                        <td className="py-3 text-xs text-gray-800">
                          {t.transaction_id}
                        </td>
                        <td className="py-3 text-right text-xs text-gray-700">
                          {t.amount} BDT
                        </td>
                        <td className="py-3 text-xs text-gray-700">
                          {t.payment_gateway}
                        </td>
                        <td className="py-3 text-xs">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              t.status === "success"
                                ? "bg-green-100 text-green-800"
                                : t.status === "failed"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td className="py-3 text-xs text-gray-500">
                          {formatDate(t.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No transactions recorded for this order.
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="border-t-2 border-gray-300 pt-6 text-center text-xs text-gray-600">
            <p>Thank you for using To-Let Platform!</p>
            <p className="mt-2">
              This is an automatically generated invoice.
            </p>
            <p className="mt-4 text-gray-500">
              Generated on {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
