import React, { useRef } from "react";
import { FaDownload, FaTimes, FaPrint } from "react-icons/fa";
import html2pdf from "html2pdf.js";
import Swal from "sweetalert2";
import Logo from "../../../assets/logo.png";

const Invoice = ({ order, isOpen, onClose }) => {
  const invoiceRef = useRef(null);

  if (!isOpen || !order) return null;

  const handleDownload = async () => {
    const element = invoiceRef.current;

    if (!element) {
      Swal.fire('Error', 'Invoice element not found', 'error');
      return;
    }

    if (!html2pdf || typeof html2pdf !== 'function') {
      console.error('html2pdf not available', html2pdf);
      Swal.fire('Error', 'PDF generator is not available. Try printing instead.', 'error');
      return;
    }

    const waitForImages = (el) => {
      const imgs = el.querySelectorAll('img');
      const failed = [];
      const promises = Array.from(imgs).map((img) => {
        // If image already loaded and has dimensions, consider success
        if (img.complete && img.naturalWidth && img.naturalWidth > 0) return Promise.resolve();

        return new Promise((resolve) => {
          const onLoad = () => {
            cleanup();
            resolve();
          };
          const onErr = () => {
            failed.push(img.src || '(inline image)');
            cleanup();
            resolve();
          };
          const cleanup = () => {
            img.removeEventListener('load', onLoad);
            img.removeEventListener('error', onErr);
          };

          img.addEventListener('load', onLoad);
          img.addEventListener('error', onErr);

          // Try to force CORS if image is remote (best-effort)
          try {
            if (img.src && !img.src.startsWith('data:') && !img.crossOrigin) {
              img.crossOrigin = 'anonymous';
              // Re-assigning src to re-request with crossOrigin (some browsers may re-fetch)
              const current = img.src;
              img.src = '';
              img.src = current;
            }
          } catch (e) {
            // ignore
          }

          // In case the image is already in an errored state, give it a short timeout
          setTimeout(() => {
            if (!img.complete || (img.naturalWidth === 0 && !failed.includes(img.src))) {
              failed.push(img.src || '(unknown)');
              cleanup();
              resolve();
            }
          }, 2000);
        });
      });

      return Promise.all(promises).then(() => failed);
    };

    try {
      const failedImgs = await waitForImages(element);

      if (failedImgs && failedImgs.length > 0) {
        console.warn('PDF: some images failed to load:', failedImgs);
        Swal.fire('Warning', `Some images failed to load and may not appear in the PDF:\n\n${failedImgs.join('\n')}`, 'warning');
      }

      const opt = {
        margin: 10,
        filename: `Invoice-Order-${order.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, allowTaint: false, logging: false },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('PDF generation failed', err);
      const msg = (err && err.message) || 'Unknown error while generating PDF';
      Swal.fire('Error', `Failed to generate PDF: ${msg}\n\nCheck console for details.`, 'error');
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "", "width=900,height=600");
    printWindow.document.write(invoiceRef.current.innerHTML);
    printWindow.document.close();
    printWindow.print();
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

  const statusBadgeColor = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
  };

  const paymentBadgeColor = {
    paid: "bg-green-100 text-green-800",
    unpaid: "bg-red-100 text-red-800",
    failed: "bg-orange-100 text-orange-800",
  };

  const payable = order.cost || order.budget;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-screen overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={Logo} alt="To-Let" className="w-28 h-auto" />
            <div>
              <h2 className="text-xl font-bold text-gray-800">To-Let Platform</h2>
              <p className="text-sm text-gray-500">Dhaka, Bangladesh</p>
            </div>
          </div>

          <div className="text-right">
            <h3 className="text-3xl font-extrabold text-[#EC733B]">INVOICE</h3>
            <p className="text-sm text-gray-600">Order ID: #{order.id}</p>
          </div>

          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="sticky top-20 bg-gray-50 border-b border-gray-200 p-4 flex gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-[#EC733B] hover:bg-[#d9612c] text-white rounded-lg font-semibold transition"
          >
            <FaDownload /> Download PDF
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg font-semibold transition"
          >
            <FaPrint /> Print
          </button>
        </div>

        {/* Invoice Content */}
        <div ref={invoiceRef} className="p-8 bg-white">
          {/* Top section: details & totals */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-start">
            <div>
              <h4 className="text-sm font-bold text-gray-600 uppercase">Bill To</h4>
              <p className="mt-2 text-sm text-gray-700">
                <strong>{order.contact_name || 'Customer'}</strong>
                <br />
                {order.contact_phone}
                <br />
                {order.contact_email}
              </p>
            </div>

            <div className="col-span-1 md:col-span-1">
              <h4 className="text-sm font-bold text-gray-600 uppercase">Order Details</h4>
              <div className="mt-2 text-sm text-gray-700">
                <p><strong>Location:</strong> {order.area}, {order.district}</p>
                <p><strong>Room:</strong> {order.room} Room</p>
                <p><strong>Package:</strong> {order.package_code || 'standard'}</p>
                <p><strong>Created:</strong> {formatDate(order.created_at)}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 items-end">
              <div className="bg-gray-50 p-4 rounded-lg w-full md:w-44 text-right">
                <div className="text-sm text-gray-600">User Budget</div>
                <div className="font-semibold text-gray-800">{order.budget} BDT</div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-inner border border-gray-100 w-full md:w-44 text-right mt-2">
                <div className="text-sm text-gray-600">Payable</div>
                <div className="text-2xl font-extrabold text-[#EC733B]">{payable} BDT</div>
              </div>

              <div className={`mt-2 inline-block text-xs px-3 py-1 rounded-full ${paymentBadgeColor[order.payment_status] || 'bg-gray-100 text-gray-800'}`}>
                {order.payment_status}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-6">
            <table className="w-full">
              <thead>
                <tr className="border-t-2 border-b-2 border-gray-300">
                  <th className="text-left py-3 text-sm font-bold text-gray-700">Description</th>
                  <th className="text-right py-3 text-sm font-bold text-gray-700">Amount (BDT)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-3 text-sm text-gray-700">Order Placement Fee</td>
                  <td className="text-right py-3 text-sm text-gray-700">{payable}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Transactions */}
          <div className="mb-6">
            <h4 className="text-sm font-bold text-gray-600 uppercase mb-3">Transaction History</h4>
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
                        <td className="py-3 text-xs text-gray-800">{t.transaction_id}</td>
                        <td className="py-3 text-right text-xs text-gray-700">{t.amount} BDT</td>
                        <td className="py-3 text-xs text-gray-700">{t.payment_gateway}</td>
                        <td className="py-3 text-xs">
                          <span className={`px-2 py-1 rounded-full text-xs ${t.status === 'success' ? 'bg-green-100 text-green-800' : t.status === 'failed' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'}`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="py-3 text-xs text-gray-500">{formatDate(t.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No transactions recorded for this order.</p>
            )}
          </div>

          {/* Footer */}
          <div className="border-t-2 border-gray-300 pt-6 text-center text-xs text-gray-600">
            <p>Thank you for using To-Let Platform!</p>
            <p className="mt-2">This is an automatically generated invoice. For support, please contact us.</p>
            <p className="mt-4 text-gray-500">Generated on {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
