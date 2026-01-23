import React, { useState, useMemo } from "react";
import Swal from "sweetalert2";
import api from "../../../api";
import { useNavigate } from "react-router-dom";

const dhakaLocations = ["Adabor", "Airport", "Badda", "Banani", "Bangshal", "Bhashantek", "Cantonment", "Chawkbazar", "Darussalam", "Daskhinkhan", "Demra", "Dhamrai", "Dhanmondi", "Dohar", "Gandaria", "Gulshan", "Hazaribag", "Jatrabari", "Kafrul", "Kalabagan", "Kamrangirchar", "Keraniganj", "Khilgaon", "Khilkhet", "Kotwali", "Lalbag", "Mirpur", "Mohammadpur", "Motijheel", "Mugda", "Nawabganj", "New Market", "Others", "Pallabi", "Paltan", "Purbachal", "Ramna", "Rampura", "Rupnagar", "Sabujbag", "Savar", "Shah Ali", "Shahbag", "Shahjahanpur", "Sher-E-Bangla Nagar", "Shyampur", "Sutrapur", "Tejgaon", "Tejgaon I/A", "Turag", "Uttara", "Uttarkhan", "Vatara", "Wari"];

const packages = [{ id: "pack01", label: "7 Days Only", price: 1000 }];

const OrderPropertyNow = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    division: "Dhaka",
    district: "Dhaka",
    area: "",
    subarea: "",
    category: "Family",
    room: "",
    move_in_month: "",
    budget: "",
    details: "",
    package: packages[0].id,
    tac: false,
    phone: "",
    name: "",
    email: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const cost = useMemo(() => {
    const p = packages.find((x) => x.id === form.package);
    return p ? p.price : 1000; 
  }, [form.package]);

  
  const subareas = [];

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    // if area changes, reset subarea
    if (name === "area") {
      setForm((s) => ({ ...s, area: value, subarea: "" }));
      return;
    }
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  }

  const validate = () => {
    if (!form.area) return Swal.fire("Error", "Select area", "warning");
    if (!form.room || !form.move_in_month || !form.budget || !form.phone)
      return Swal.fire("Error", "Please fill all required fields", "warning");
    if (!/^\d{11}$/.test(form.phone))
      return Swal.fire("Error", "Phone number must be exactly 11 digits (e.g., 01XXXXXXXXX)", "warning");
    if (!form.tac)
      return Swal.fire("Error", "Accept Terms & Conditions", "warning");
    return true;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      division: form.division,
      district: form.district,
      area: form.area,
      subarea: form.subarea,
      category: form.category,
      room: form.room,
      move_in_month: form.move_in_month,
      budget: form.budget,
      details: form.details,
      package_code: form.package,
      cost,
      contact_name: form.name,
      contact_phone: form.phone,
      contact_email: form.email,
    };

    try {
      setSubmitting(true);

      Swal.fire({
        title: "Submitting order...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await api.post("/order-property", payload);

      Swal.close();

      Swal.fire({
        icon: "success",
        title: "Order Submitted",
        text: "Proceed to payment",
        confirmButtonText: "Pay Now",
        confirmButtonColor: "#e45716",
      }).then(async (result) => {
        if (result.isConfirmed) {
          
          try {
            Swal.fire({
              title: "Processing payment...",
              allowOutsideClick: false,
              didOpen: () => Swal.showLoading(),
            });

            const payRes = await api.post('/initiate-order-payment', { order_id: res.data.order.id });
            Swal.close();

            const data = payRes?.data || {};
            const gateway = data.GatewayPageURL || data.gateway_url || data.gateway_redirect || data.redirect_url || null;

            if (!gateway) {
              throw new Error(data?.failedreason || data?.message || 'No gateway URL returned');
            }

            window.location.href = gateway;
          } catch (e) {
            Swal.close();
            Swal.fire({ icon: 'error', title: 'Payment initiation failed', text: e?.response?.data?.message || e?.message || 'Try again later' });
          }
        }
      });
    } catch (err) {
      Swal.close();
      Swal.fire(
        "Submission failed",
        err?.response?.data?.message || "Try again later",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mb-20 flex justify-center px-4">
      <div className="w-full max-w-3xl">
        <form
          className="card bg-white shadow-md rounded-lg p-6"
          onSubmit={handleSubmit}
        >
          <h3 className="text-xl font-semibold text-[#EC733B] mb-4">
            Property Requirement
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Division
              </label>
              <input
                value="Dhaka"
                disabled
                className="w-full px-3 py-2 border rounded bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                District
              </label>
              <input
                value="Dhaka"
                disabled
                className="w-full px-3 py-2 border rounded bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Area*
              </label>
              <select
                name="area"
                value={form.area}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="">Select area (Dhaka)</option>
                {dhakaLocations.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subarea (user types the name) */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subarea
            </label>
            <input
              type="text"
              name="subarea"
              value={form.subarea}
              onChange={handleChange}
              placeholder="Enter subarea name (e.g., Bashundhara R.A, Banani Road 11)"
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          {/* category, room, month */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category*
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              >
                <option>Family</option>
                <option>Bachelor</option>
                <option>Office</option>
                <option>Sublet</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room*
              </label>
              <select
                name="room"
                value={form.room}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="">Select required room</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property need from*
              </label>
              <select
                name="move_in_month"
                value={form.move_in_month}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="">Select month</option>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>
          </div>

          {/* budget & details */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum budget*
            </label>
            <input
              type="number"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              placeholder="Enter maximum budget (BDT)"
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Details requirement
            </label>
            <textarea
              name="details"
              value={form.details}
              onChange={handleChange}
              rows="4"
              placeholder="আপনার চাহিদাগুলো উল্লেখ করে বিস্তারিত লিখুন..."
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          {/* contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                placeholder="Your name (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone*
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                placeholder="01XXXXXXXXX"
                maxLength="11"
                pattern="\d{11}"
                required
              />
              {form.phone && !/^\d{11}$/.test(form.phone) && (
                <p className="text-red-500 text-sm mt-1">Phone must be 11 digits (e.g., 01912345678)</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              placeholder="you@example.com (optional)"
            />
          </div>

          {/* package */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Choose package</h3>
            <div className="flex flex-col gap-2">
              {packages.map((p) => (
                <label key={p.id} className="inline-flex items-center gap-3">
                  <input
                    type="radio"
                    name="package"
                    value={p.id}
                    checked={form.package === p.id}
                    onChange={handleChange}
                    className="form-radio"
                  />
                  <span>
                    {p.label} — {p.price} BDT
                  </span>
                </label>
              ))}
            </div>
          </div>

          <h2 className="text-lg font-semibold mt-6">
            Order cost : <span id="cost">{cost} BDT</span>
          </h2>

          <label className="flex items-start gap-3 mt-4">
            <input
              name="tac"
              type="checkbox"
              checked={form.tac}
              onChange={handleChange}
              className="mt-1"
            />
            <span className="text-sm">
              I agree to the{" "}
              <a
                className="text-blue-600"
                href="/terms"
                target="_blank"
                rel="noreferrer"
              >
                Terms & Conditions
              </a>
              ,{" "}
              <a
                className="text-blue-600"
                href="/privacy"
                target="_blank"
                rel="noreferrer"
              >
                Privacy Policy
              </a>
              , and{" "}
              <a
                className="text-blue-600"
                href="/refund"
                target="_blank"
                rel="noreferrer"
              >
                Refund Policy
              </a>
              .
            </span>
          </label>

          <div className="mt-6">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#EC733B] hover:bg-[#d35f25] text-white font-semibold py-3 rounded-lg disabled:opacity-60 cursor-pointer"
            >
              {submitting ? "Submitting..." : "Submit & Pay"}
            </button>
            <p className="text-sm text-green-600 text-center mt-2">
              Payment Refundable*
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderPropertyNow;
