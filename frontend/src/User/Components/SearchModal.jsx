// src/components/SearchModal.jsx
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const dhakaLocations = ["Adabor", "Airport", "Badda", "Banani", "Bangshal", "Bhashantek", "Cantonment", "Chawkbazar", "Darussalam", "Daskhinkhan", "Demra", "Dhamrai", "Dhanmondi", "Dohar", "Gandaria", "Gulshan", "Hazaribag", "Jatrabari", "Kafrul", "Kalabagan", "Kamrangirchar", "Keraniganj", "Khilgaon", "Khilkhet", "Kotwali", "Lalbag", "Mirpur", "Mohammadpur", "Motijheel", "Mugda", "Nawabganj", "New Market", "Others", "Pallabi", "Paltan", "Purbachal", "Ramna", "Rampura", "Rupnagar", "Sabujbag", "Savar", "Shah Ali", "Shahbag", "Shahjahanpur", "Sher-E-Bangla Nagar", "Shyampur", "Sutrapur", "Tejgaon", "Tejgaon I/A", "Turag", "Uttara", "Uttarkhan", "Vatara", "Wari"];

const SearchModal = ({ isOpen, onClose, onNavigate }) => {
  const [mounted, setMounted] = useState(false);

  // form state
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [area, setArea] = useState("");
  const [subarea, setSubarea] = useState("");

  // animate on open
  useEffect(() => {
    if (isOpen) {
      setMounted(false);
      const id = setTimeout(() => setMounted(true), 16);
      return () => clearTimeout(id);
    } else {
      setMounted(false);
    }
  }, [isOpen]);

  // close on Escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categoryOptions = [
    { id: "1", label: "Family" },
    { id: "2", label: "Bachelor" },
    { id: "3", label: "Office" },
    { id: "4", label: "Sublet" },
    { id: "5", label: "Hostel" },
  ];

  async function submitHandler(e) {
    e.preventDefault();

    // direct property lookup by id -> go to details page
    if (q && q.trim()) {
      const id = q.trim();
      const url = `/property-post/${encodeURIComponent(id)}`;
      if (onNavigate) return onNavigate(url);
      window.location.href = url;
      return;
    }

    if (!area) {
      Swal.fire({
        icon: "warning",
        title: "Area Required",
        text: "Please select an area to search.",
        confirmButtonColor: "#e45716",
      });
      return;
    }

    const params = new URLSearchParams();
    params.set("area", area);
    if (subarea) params.set("subarea", subarea);
    if (category) params.set("category", category);

    const url = `/search-results?${params.toString()}`;
    if (onNavigate) return onNavigate(url);
    window.location.href = url;
  }

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      {/* backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={`relative w-full max-w-2xl rounded-2xl overflow-hidden transform transition-all duration-300
          bg-white/80 backdrop-blur-md shadow-2xl
          ${mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"}
        `}
        role="dialog"
        aria-modal="true"
      >
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/40">
          <h3 className="text-lg font-semibold">Property search</h3>
          <button onClick={onClose} className="text-gray-700 hover:text-black px-2 cursor-pointer" aria-label="Close">✕</button>
        </div>

        {/* body */}
        <form onSubmit={submitHandler} className="p-6 space-y-5">
          {/* property id */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Property ID</label>
            <div className="flex gap-2 mt-1">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Property ID..."
                className="flex-1 border rounded-lg px-3 py-2 bg-white/90 outline-none focus:shadow-md"
              />
              <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-lg cursor-pointer">Search</button>
            </div>
          </div>

          <div className="text-center text-gray-400">— or —</div>

          {/* category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(category === c.id ? "" : c.id)}
                  className={`px-3 py-2 rounded-lg border text-sm ${category === c.id ? "bg-orange-100 border-orange-400 shadow-sm" : "bg-white/90"}`}
                >
                  <span className="capitalize">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Division</label>
              <input disabled value="Dhaka" className="w-full border rounded-lg px-3 py-2 bg-gray-100" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
              <input disabled value="Dhaka" className="w-full border rounded-lg px-3 py-2 bg-gray-100" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area / Thana</label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 bg-white/90"
              >
                <option value="">Select area</option>
                {dhakaLocations.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subarea</label>
              <input
                value={subarea}
                onChange={(e) => setSubarea(e.target.value)}
                placeholder="Enter subarea (optional)"
                className="w-full border rounded-lg px-3 py-2 bg-white/90"
              />
            </div>
          </div>

          {/* actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/40">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border bg-white/90 cursor-pointer">Close</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-500 cursor-pointer">Search</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchModal;
