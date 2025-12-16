import React, { useState, useMemo } from "react";
import Swal from "sweetalert2";
import api from "../../api";

const dhakaLocations = {
  Adabor: ["Baitul Aman Housing", "Dhaka Housing", "Monsurabad", "PC Culture Housing", "Sunibir Housing" ],
  Airport: ["Ashkona", "Hazi Camp", "Kurmitola" ],
  Badda: ["Adarsha Nagar","Aftab Nagar","Badda DIT Project","Beraid","Khilbari Tek","Merul Badda","Middle Badda","North Badda","Satarkul","South Badda"],
  Banani: ["Banani Road 11", "Banani Road 15"],
  Bangshal: ["Chankharpul", "Nazira Bazar", "Saat Rawza"],
  Bhashantek: ["Bhashantek Block A"],
  Cantonment: ["Dhaka Cantonment"],
  Chawkbazar: ["Chawkbazar Main"],
  Darussalam: ["Darussalam Area"],
  Daskhinkhan: ["Daskhinkhan"],
  Demra: ["Amulia", "Dogair", "Konapara", "Matuail", "Nayapara", "Sanarpar", "Sarulia"],
  Dhamrai: ["Amta","Baishkanda","Balia","Bhararia","Chauhat","Ganggutia","Jadabpur","Kulla","Kushura","Nannar","Roail","Sanura","Sombhag","Suapur","Sutipara"],
  Dhanmondi: ["Dhanmondi 15","Dhanmondi 32","Elephant Road","Rabindra Sorubar","Shangkar","Sobhanbagh","Vuter Goli","West Dhanmondi","Zigatola"],
  Dohar: ["Dohar"],
  Gandaria: ["LPG Point","Niketon"],
  Gulshan: ["Baridhara","Gulshan 1","Gulshan 2","Kalachandpur","Mohakhali","Nadda","Niketon","Shahjadpur"],
  Hazaribag: ["Hazaribag"],
  Jatrabari: ["Jatrabari North", "Jatrabari South"],
  Kafrul: ["Kafrul"],
  Kalabagan: ["Kalabagan"],
  Kamrangirchar: ["Kamrangirchar"],
  Keraniganj: ["Keraniganj"],
  Khilgaon: ["Khilgaon"],
  Khilkhet: ["Khilkhet"],
  Kotwali: ["Kotwali"],
  Lalbag: ["Lalbagh"],
  Mirpur: ["Mirpur 1", "Mirpur 10", "Mirpur 11"],
  Mohammadpur: ["Mohammadpur"],
  Motijheel: ["Motijheel"],
  Mugda: ["Mugda"],
  Nawabganj: ["Nawabganj"],
  "New Market": ["New Market"],
  Others: [],
  Pallabi: ["Pallabi"],
  Paltan: ["Paltan"],
  Purbachal: ["Purbachal"],
  Ramna: ["Ramna"],
  Rampura: ["Rampura Banasree", "Rampura Wapda Road", "Rampura Mohanagar"],
  Rupnagar: ["Rupnagar"],
  Sabujbag: ["Sabujbagh"],
  Savar: ["Savar"],
  "Shah Ali": ["Shah Ali"],
  Shahbag: ["Shahbag"],
  Shahjahanpur: ["Shahjahanpur"],
  "Sher-E-Bangla Nagar": ["Sher-E-Bangla Nagar"],
  Shyampur: ["Shyampur"],
  Sutrapur: ["Sutrapur"],
  Tejgaon: ["Arjatpara", "Bijoy Soroni", "Farmgate", "Kamarbari", "Kawran Bazar", "Nakhal Para", "Raja Bazar", "Shukrabad", "Tejkuni Para", "West Rajarbazar"],
  "Tejgaon I/A": ["Tejgaon Industrial Area"],
  Turag: ["Turag"],
  Uttara: [
  "Abdullahpur","Azampur","Bamnartek","Baunia","Bhatuliya","Diyabari",
  "House Building","Kamarpara","Rosdia","Rupayan City",
  "Sector 1","Sector 2","Sector 3","Sector 4","Sector 5",
  "Sector 6","Sector 7","Sector 8","Sector 9", "Sector 10","Sector 11","Sector 12","Sector 13","Sector 14",
  "Sector 15","Sector 18"],
  Uttarkhan: ["Beparipara", "Gulgulia", "Master Bari", "Nowapara"],
  Vatara: ["100 Ft Rood", "Bashundhara R.A", "Kuril", "Natun Bazar", "Nurer Chala", "Sayeed Nagar", "Solmaid"],
  Wari: ["Narinda", "Sayedabad", "Tikatuli"],
};

const packages = [{ id: "tpdj0", label: "7 Days Only", price: 1000 }];

const OrderPropertyNow = () => {
  const [form, setForm] = useState({
    division: "Dhaka", // fixed to Dhaka as requested
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

  // cost from selected package
  const cost = useMemo(() => {
    const p = packages.find((x) => x.id === form.package);
    return p ? p.price : 0;
  }, [form.package]);

  // subareas for currently selected area (empty array if none)
  const subareas = form.area ? dhakaLocations[form.area] || [] : [];

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    // if area changes, reset subarea
    if (name === "area") {
      setForm((s) => ({ ...s, area: value, subarea: "" }));
      return;
    }
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  }

  function validate() {
    if (!form.area) {
      Swal.fire("Validation", "Please select an area (Dhaka only).", "warning");
      return false;
    }
    // if area has subareas, require subarea
    if (subareas.length > 0 && !form.subarea) {
      Swal.fire("Validation", "Please select a subarea for the chosen area.", "warning");
      return false;
    }
    if (!form.room) {
      Swal.fire("Validation", "Please select number of rooms.", "warning");
      return false;
    }
    if (!form.move_in_month) {
      Swal.fire("Validation", "Please select the month you need the property from.", "warning");
      return false;
    }
    if (!form.budget) {
      Swal.fire("Validation", "Please enter maximum budget.", "warning");
      return false;
    }
    if (!form.tac) {
      Swal.fire("Terms", "You must agree to the Terms & Conditions to continue.", "warning");
      return false;
    }
    if (!form.phone) {
      Swal.fire("Contact", "Please provide a phone number so we can contact you.", "warning");
      return false;
    }
    return true;
  }

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
      cost: cost,
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

      // If you don't have backend yet, you can comment the line below to avoid errors.
      const res = await api.post("/order-property", payload);

      Swal.close();

      if (res?.data?.payment_url) {
        Swal.fire({
          icon: "success",
          title: "Order created",
          html: "You will be redirected to payment.",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => window.location.href = res.data.payment_url);
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Order submitted",
        text: res?.data?.message || "We received your order. Our representative will contact you.",
      });

      // optional: clear details field after submit
      setForm((s) => ({ ...s, details: "" }));
    } catch (err) {
      Swal.close();
      console.error("Order submit error:", err);
      const serverMsg = err?.response?.data?.message || err.message || "Please try again later.";
      Swal.fire({
        icon: "error",
        title: "Submission failed",
        text: serverMsg,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-25 mb-20 flex justify-center px-4">
      <div className="w-full max-w-3xl">
        <form className="card bg-white shadow-md rounded-lg p-6" onSubmit={handleSubmit}>
          <h3 className="text-xl font-semibold text-[#EC733B] mb-4">Property Requirement</h3>

          {/* Division / District / Area */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Division</label>
              <input value="Dhaka" disabled className="w-full px-3 py-2 border rounded bg-gray-100" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
              <input value="Dhaka" disabled className="w-full px-3 py-2 border rounded bg-gray-100" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area*</label>
              <select
                name="area"
                value={form.area}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="">Select area (Dhaka)</option>
                {Object.keys(dhakaLocations).map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Subarea (shows only when subareas exist for chosen area) */}
          {subareas.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Subarea*</label>
              <select
                name="subarea"
                value={form.subarea}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="">Select subarea</option>
                {subareas.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}

          {/* category, room, month */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2 border rounded">
                <option>Family</option>
                <option>Bachelor</option>
                <option>Office</option>
                <option>Sublet</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room*</label>
              <select name="room" value={form.room} onChange={handleChange} className="w-full px-3 py-2 border rounded" required>
                <option value="">Select required room</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property need from*</label>
              <select name="move_in_month" value={form.move_in_month} onChange={handleChange} className="w-full px-3 py-2 border rounded" required>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Maximum budget*</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Details requirement</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2 border rounded" placeholder="Your name (optional)" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone*</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-3 py-2 border rounded" placeholder="01XXXXXXXXX" required />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input name="email" value={form.email} onChange={handleChange} className="w-full px-3 py-2 border rounded" placeholder="you@example.com (optional)" />
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
                  <span>{p.label} — {p.price} BDT</span>
                </label>
              ))}
            </div>
          </div>

          <h2 className="text-lg font-semibold mt-6">
            Order cost : <span id="cost">{cost} BDT</span>
          </h2>

          <label className="flex items-start gap-3 mt-4">
            <input name="tac" type="checkbox" checked={form.tac} onChange={handleChange} className="mt-1" />
            <span className="text-sm">
              I agree to the <a className="text-blue-600" href="/terms" target="_blank" rel="noreferrer">Terms & Conditions</a>, <a className="text-blue-600" href="/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>, and <a className="text-blue-600" href="/refund" target="_blank" rel="noreferrer">Refund Policy</a>.
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
            <p className="text-sm text-green-600 text-center mt-2">Payment Refundable*</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderPropertyNow;
