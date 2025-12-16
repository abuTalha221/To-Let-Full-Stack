import React, { useState } from "react";

/* ---------- Static lists ---------- */
const months = [
  { value: "", label: "Select Month" },
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const categories = [
  { value: "", label: "Select Category" },
  { value: "2", label: "Bachelor" },
  { value: "1", label: "Family" },
  { value: "5", label: "Hostel" },
  { value: "3", label: "Office" },
  { value: "4", label: "Sublet" },
];

// Dhaka main areas (mobile-friendly list)
const dhakaAreas = [
  "Adabor","Airport","Badda","Banani","Bangshal","Bhashantek","Cantonment","Chawkbazar",
  "Darussalam","Daskhinkhan","Demra","Dhamrai","Dhanmondi","Dohar","Gandaria","Gulshan",
  "Hazaribag","Jatrabari","Kafrul","Kalabagan","Kamrangirchar","Keraniganj","Khilgaon",
  "Khilkhet","Kotwali","Lalbag","Mirpur","Mohammadpur","Motijheel","Mugda","Nawabganj",
  "New Market","Others","Pallabi","Paltan","Purbachal","Ramna","Rampura","Rupnagar",
  "Sabujbag","Savar","Shah Ali","Shahbag","Shahjahanpur","Sher-E-Bangla Nagar","Shyampur",
  "Sutrapur","Tejgaon","Tejgaon I/A","Turag","Uttara","Uttarkhan","Vatara","Wari"
];

const numOptions = (n) => Array.from({ length: n }, (_, i) => ({ value: `${i+1}`, label: `${i+1}` }));

/* ---------- Component ---------- */
const AddProperty = () => {
  const [form, setForm] = useState({
    monthId: "",
    primaryCategory: "",
    propertyTypeId: "",
    bedroom: "",
    bathroom: "",
    balcony: "",
    floor: "",
    gender: "",
    size: "",
    divisionId: 3,
    districtId: 1,
    area: "",
    subarea: "",
    sector_no: "",
    road_no: "",
    house_no: "",
    place: "", // now a textarea (required)
    price: "",
    priceType: "Monthly",
    electricity: false,
    water: false,
    security: false,
    gas: false,
    lift: false,
  });

  // images state: { file, url, id, loaded }
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // ---------- handlers ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const toggle = (name) => setForm((s) => ({ ...s, [name]: !s[name] }));

  // ---------- validation ----------
  const validate = () => {
    if (!form.monthId) return "Select month";
    if (!form.primaryCategory) return "Select category";
    if (!form.propertyTypeId) return "Select property type";
    if (!form.bedroom) return "Select bedroom";
    if (!form.bathroom) return "Select bathroom";
    if (!form.gender) return "Select gender";
    if (!form.area) return "Select area";
    if (!form.place || form.place.trim().length < 5) return "Enter Short Address (mention owner details)";
    if (!form.price) return "Enter price";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return alert(err);

    setSubmitting(true);

    // Example: if you had a backend you'd build FormData and append images
    console.log("Form:", form);
    console.log("Images:", images.map((i) => i.file.name));

    // simulate submit
    await new Promise((r) => setTimeout(r, 900));
    alert("Submitted (frontend-only). Check console for payload.");
    setSubmitting(false);
  };

  // ---------- image handlers ----------
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const maxFiles = 10;

  function handleFilesSelected(fileList) {
    if (!fileList) return;
    const files = Array.from(fileList).filter((f) => allowedTypes.includes(f.type));
    if (files.length === 0) return;

    const remaining = maxFiles - images.length;
    const toAdd = files.slice(0, remaining).map((file) => ({
      file,
      url: URL.createObjectURL(file),
      id: Math.random().toString(36).slice(2, 9),
      loaded: false,
    }));
    setImages((prev) => [...prev, ...toAdd]);
  }

  const onInputChange = (e) => {
    handleFilesSelected(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFilesSelected(e.dataTransfer.files);
  };

  const handleImageLoaded = (id) => {
    setImages((prev) => prev.map((it) => (it.id === id ? { ...it, loaded: true } : it)));
  };

  const removeImage = (index) => {
    try { URL.revokeObjectURL(images[index].url); } catch (err) {}
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ---------- small helper for input styling ----------
  const inputClass = "w-full border rounded-lg px-3 py-3 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-300 transition";

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 mt-20">
      {/* simple custom CSS for fade-in and tiny image hover */}
      <style>{`
        .fade-in { animation: fadeIn 400ms ease forwards; opacity: 0; }
        @keyframes fadeIn { to { opacity: 1; } }
        .img-zoom:hover img { transform: scale(1.05); }
        .img-zoom img { transition: transform .35s ease; }
      `}</style>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 fade-in">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-4">Create Post</h1>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded mb-6">
          <p className="text-sm sm:text-base">দ্রুত ভাড়াটিয়া পাওয়ার জন্য সঠিক তথ্য ও স্পষ্ট ছবি সংযুক্ত করে ফর্মটি পূরণ করুন।</p>
        </div>

        {/* BASIC */}
        <h2 className="text-lg font-medium mb-3">Basic Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <select name="monthId" value={form.monthId} onChange={handleChange} className={inputClass}>
            {months.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>

          <select name="primaryCategory" value={form.primaryCategory} onChange={handleChange} className={inputClass}>
            {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>

          <select name="propertyTypeId" value={form.propertyTypeId} onChange={handleChange} className={inputClass}>
            <option value="">Property Type</option>
            <option value="apartment">Apartment</option>
            <option value="flat">Flat</option>
            <option value="house">House</option>
            <option value="office">Office</option>
          </select>

          <select name="bedroom" value={form.bedroom} onChange={handleChange} className={inputClass}>
            <option value="">Bedrooms</option>
            {numOptions(10).map((n) => <option key={n.value} value={n.value}>{n.label}</option>)}
          </select>

          <select name="bathroom" value={form.bathroom} onChange={handleChange} className={inputClass}>
            <option value="">Bathrooms</option>
            {numOptions(10).map((n) => <option key={n.value} value={n.value}>{n.label}</option>)}
          </select>

          <select name="balcony" value={form.balcony} onChange={handleChange} className={inputClass}>
            <option value="">Balcony</option>
            {Array.from({ length: 11 }, (_, i) => i).map((n) => <option key={n} value={n}>{n}</option>)}
          </select>

          <select name="floor" value={form.floor} onChange={handleChange} className={inputClass}>
            <option value="">Floor</option>
            {numOptions(20).map((n) => <option key={n.value} value={n.value}>{n.label}</option>)}
          </select>

          <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
            <option value="">Gender</option>
            <option value="1">Only Male</option>
            <option value="2">Only Female</option>
            <option value="3">Both</option>
          </select>

          <input name="size" value={form.size} onChange={handleChange} placeholder="Size (sq ft)" className={inputClass} />
        </div>

        {/* LOCATION */}
        <h2 className="text-lg font-medium mt-6 mb-3">Location Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <input value="Dhaka" disabled className={`${inputClass} bg-gray-100`} />
          <input value="Dhaka" disabled className={`${inputClass} bg-gray-100`} />

          <select name="area" value={form.area} onChange={handleChange} className={inputClass}>
            <option value="">Select Area</option>
            {dhakaAreas.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>

          <input name="subarea" value={form.subarea} onChange={handleChange} placeholder="Sub-area (type manually)" className={inputClass} />

          <input name="sector_no" value={form.sector_no} onChange={handleChange} placeholder="Sector No" className={inputClass} />
          <input name="road_no" value={form.road_no} onChange={handleChange} placeholder="Road No" className={inputClass} />
          <input name="house_no" value={form.house_no} onChange={handleChange} placeholder="House No" className={inputClass} />

          {/* Short address as textarea - required */}
          <div className="sm:col-span-2 md:col-span-3">
            <label className="block mb-1 font-medium">Short Address (Mention Owner Details here also) <span className="text-red-500">*</span></label>
            <textarea
              name="place"
              value={form.place}
              onChange={handleChange}
              rows={3}
              required
              placeholder="Example: House 12, Road 5, Sector 3 — Owner: Mr. Rahman, 01XXXXXXXXX"
              className="w-full border rounded-lg px-3 py-2 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
            />
          </div>
        </div>

        {/* IMAGES with shimmer */}
        <h2 className="text-lg font-medium mt-6 mb-3">Images</h2>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed rounded-xl p-4 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
        >
          <input id="image-input" type="file" accept="image/*" multiple onChange={onInputChange} className="hidden" />
          <label htmlFor="image-input" className="cursor-pointer">
            <div className="py-6">
              <div className="inline-block px-4 py-2 bg-gray-800 text-white rounded-md">Browse Images</div>
            </div>
            <p className="text-xs text-gray-500">Drag & drop or click to browse (max 10). JPG / PNG / WEBP / GIF</p>
          </label>
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3">
            {images.map((it, idx) => (
              <div key={it.id} className="relative rounded-lg overflow-hidden img-zoom shadow-sm bg-white">
                {/* shimmer while loading */}
                {!it.loaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="w-full h-full animate-pulse" />
                  </div>
                )}

                <img
                  src={it.url}
                  alt={`preview-${idx}`}
                  onLoad={() => handleImageLoaded(it.id)}
                  className={`w-full h-32 object-cover ${it.loaded ? "opacity-100 transition-opacity duration-300" : "opacity-0"}`}
                />

                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {/* PRICE */}
        <h2 className="text-lg font-medium mt-6 mb-3">Price</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block mb-1 font-medium">Price *</label>
            <div className="flex">
              <input name="price" value={form.price} onChange={handleChange} placeholder="Enter price" className="flex-1 border rounded-l-lg px-3 py-2 shadow-sm focus:outline-none" />
              <span className="bg-gray-200 px-4 flex items-center rounded-r-lg">BDT</span>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Price Type</label>
            <select name="priceType" value={form.priceType} onChange={handleChange} className={inputClass}>
              <option value="Monthly">Monthly</option>
              <option value="Weekly">Weekly</option>
              <option value="Daily">Daily</option>
            </select>
          </div>
        </div>

        <div className="mt-4 p-3 border rounded-lg bg-gray-50">
          <p className="font-medium mb-2">Price Includes</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { key: "electricity", label: "Electricity bill" },
              { key: "water", label: "Water bill" },
              { key: "security", label: "Security bill" },
              { key: "gas", label: "Gas bill" },
              { key: "lift", label: "Lift bill" }
            ].map((item) => (
              <div key={item.key} className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggle(item.key)}
                  className={`w-12 h-6 cursor-pointer rounded-full flex items-center p-1 transition ${form[item.key] ? "bg-orange-500" : "bg-gray-300"}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform ${form[item.key] ? "translate-x-6" : ""}`} />
                </button>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SUBMIT */}
        <div className="mt-6 flex justify-end">
          <button type="submit" disabled={submitting} className="px-6 py-2 bg-orange-600 text-white rounded-lg shadow hover:bg-orange-500 transition cursor-pointer">
            {submitting ? "Submitting..." : "Submit Property"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProperty;
