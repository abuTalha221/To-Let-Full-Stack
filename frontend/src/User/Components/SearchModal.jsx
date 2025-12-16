// src/components/SearchModal.jsx
import React, { useState, useEffect } from "react";



const dhakaLocations = {
  Adabor: ["Baitul Aman Housing", "Dhaka Housing", "Monsurabad", "PC Culture Housing", "Sunibir Housing"],
  Airport: ["Ashkona", "Hazi Camp", "Kurmitola"],
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
    "Sector 6","Sector 7","Sector 8","Sector 9","Sector 10","Sector 11",
    "Sector 12","Sector 13","Sector 14","Sector 15","Sector 18"
  ],
  Uttarkhan: ["Beparipara","Gulgulia","Master Bari","Nowapara"],
  Vatara: ["100 Ft Rood","Bashundhara R.A","Kuril","Natun Bazar","Nurer Chala","Sayeed Nagar","Solmaid"],
  Wari: ["Narinda", "Sayedabad", "Tikatuli"],
};

function slugify(s) {
  if (!s) return "";
  return s.toString().trim().toLowerCase().replace(/&/g, "-and-").replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "").replace(/\-+/g, "-");
}

const SearchModal = ({ isOpen, onClose, onNavigate }) => {
  const [mounted, setMounted] = useState(false);

  // form state
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [area, setArea] = useState("");
  const [subarea, setSubarea] = useState("");

  // list of areas from dhakaLocations keys
  const areaList = Object.keys(dhakaLocations);

  // subareas for currently selected area
  const [availableSubareas, setAvailableSubareas] = useState([]);

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

  // update subareas when area changes; hide subarea until area selected
  useEffect(() => {
    if (area) {
      const subs = dhakaLocations[area] || [];
      setAvailableSubareas(subs);
      setSubarea(""); // reset
    } else {
      setAvailableSubareas([]);
      setSubarea("");
    }
  }, [area]);

  // close on Escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function submitHandler(e) {
    e.preventDefault();

    // property id direct
    if (q && q.trim()) {
      const id = q.trim();
      const url = ``;
      if (onNavigate) return onNavigate(url);
      window.location.href = url;
      return;
    }

    if (!area) {
      alert("Please select an area.");
      return;
    }

    const base = "";
    const path = ["dhaka", "dhaka", slugify(area)].join("/");

    const params = [];
    if (category) params.push(`category=${encodeURIComponent(category)}`);
    if (subarea) params.push(`subarea=${encodeURIComponent(subarea)}`);

    const finalUrl = `${base}/${path}${params.length ? "?" + params.join("&") : ""}`;

    if (onNavigate) return onNavigate(finalUrl);
    window.location.href = finalUrl;
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
              {["family","bachelor","office","sublet","commercial space"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(category === c ? "" : c)}
                  className={`px-3 py-2 rounded-lg border text-sm ${category === c ? "bg-orange-100 border-orange-400 shadow-sm" : "bg-white/90"}`}
                >
                  <span className="capitalize">{c}</span>
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
                {areaList.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            {/* Subarea: hidden until area chosen */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subarea
              </label>

              {/* If no area chosen => show helper text */}
              {!area && (
                <div className="text-gray-400 text-sm mt-1">Select an area first to choose subarea</div>
              )}

              {/* When area chosen and there are subareas => show select */}
              {area && availableSubareas.length > 0 && (
                <select
                  value={subarea}
                  onChange={(e) => setSubarea(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 bg-white/90"
                >
                  <option value="">Select subarea</option>
                  {availableSubareas.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              )}

              {/* When area chosen but no predefined subareas => show manual input */}
              {area && availableSubareas.length === 0 && (
                <input
                  value={subarea}
                  onChange={(e) => setSubarea(e.target.value)}
                  placeholder="Type subarea (no predefined list)"
                  className="w-full border rounded-lg px-3 py-2 bg-white/90"
                />
              )}
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
