import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../../api";
import Swal from "sweetalert2";

/* ---------- STATIC LISTS ---------- */
const months = [
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
  { value: "2", label: "Bachelor" },
  { value: "1", label: "Family" },
  { value: "5", label: "Hostel" },
  { value: "3", label: "Office" },
  { value: "4", label: "Sublet" },
];

const dhakaAreas = [];

const numOptions = (n) => Array.from({ length: n }, (_, i) => i + 1);

/* ---------- IMAGE BASE ---------- */
const IMAGE_BASE_URL = "http://localhost:8000/storage";

const inputClass =
  "w-full border rounded-lg px-3 py-3 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-300 transition";

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [existingImages, setExistingImages] = useState([]);
  const [removeImages, setRemoveImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

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
    division: "Dhaka",
    district: "Dhaka",
    area: "",
    subarea: "",
    sector_no: "",
    road_no: "",
    house_no: "",
    contact: "",
    price: "",
    priceType: "Monthly",

    /* 🔥 PRICE INCLUDES */
    electricity: false,
    water: false,
    security: false,
    gas: false,
    lift: false,
  });

  /* ---------- FETCH PROPERTY ---------- */
  useEffect(() => {
    fetchProperty();
  }, []);

  const fetchProperty = async () => {
    try {
      const res = await api.get(`/properties/${id}`);
      const p = res.data.property;

      setForm({
        monthId: String(p.month_id),
        primaryCategory: String(p.primary_category),
        propertyTypeId: p.property_type,
        bedroom: p.bedroom,
        bathroom: p.bathroom,
        balcony: p.balcony ?? "",
        floor: p.floor ?? "",
        gender: p.gender ?? "",
        size: p.size ?? "",
        division: p.division,
        district: p.district,
        area: p.area,
        subarea: p.subarea ?? "",
        sector_no: p.sector_no ?? "",
        road_no: p.road_no ?? "",
        house_no: p.house_no ?? "",
        contact: p.contact,
        price: p.price,
        priceType: p.price_type,
        electricity: !!p.electricity,
        water: !!p.water,
        security: !!p.security,
        gas: !!p.gas,
        lift: !!p.lift,
      });

      setExistingImages(p.images || []);
    } catch {
      Swal.fire("Error", "Failed to load property", "error");
      navigate("/user/my-properties");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- HANDLERS ---------- */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const toggle = (key) => setForm((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleRemoveImage = (id) => {
    setRemoveImages((p) => [...p, id]);
    setExistingImages((p) => p.filter((img) => img.id !== id));
  };

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);

    const mapped = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setNewImages((prev) => [...prev, ...mapped]);

    // 🔥 IMPORTANT
    e.target.value = null;
  };

  const removeNewImage = (index) => {
    URL.revokeObjectURL(newImages[index].preview);

    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const fd = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (["electricity", "water", "security", "gas", "lift"].includes(key)) {
        fd.append(key, value ? 1 : 0);
      } else {
        fd.append(key, value);
      }
    });

    removeImages.forEach((id) => fd.append("remove_images[]", id));
    newImages.forEach((img) => {
      fd.append("images[]", img.file);
    });

    try {
      await api.post(`/properties/${id}?_method=PUT`, fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire("Updated", "Property updated & sent for approval", "success");
      navigate("/user/my-properties");
    } catch {
      Swal.fire("Error", "Update failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-20 text-gray-500 animate-pulse">
        Loading property...
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl p-6 space-y-6"
      >
        <h1 className="text-2xl font-semibold">Edit Property</h1>

        {/* ================= BASIC INFO ================= */}
        <h2 className="text-lg font-medium">Basic Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Month</label>
            <select
              disabled
              value={form.monthId}
              className={`${inputClass} bg-gray-100`}
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Category</label>
            <select
              disabled
              value={form.primaryCategory}
              className={`${inputClass} bg-gray-100`}
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Property Type
            </label>
            <input
              disabled
              value={form.propertyTypeId}
              className={`${inputClass} bg-gray-100`}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Bedrooms</label>
            <select
              name="bedroom"
              value={form.bedroom}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select</option>
              {numOptions(10).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Bathrooms</label>
            <select
              name="bathroom"
              value={form.bathroom}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select</option>
              {numOptions(10).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Size (sq ft)
            </label>
            <input
              name="size"
              value={form.size}
              onChange={handleChange}
              placeholder="e.g. 1200"
              className={inputClass}
            />
          </div>
        </div>

        {/* ================= LOCATION ================= */}
        <h2 className="text-lg font-medium">Location Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Division</label>
            <input
              disabled
              value={form.division}
              className={`${inputClass} bg-gray-100`}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">District</label>
            <input
              disabled
              value={form.district}
              className={`${inputClass} bg-gray-100`}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Area</label>
            <input
              disabled
              value={form.area}
              className={`${inputClass} bg-gray-100`}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Sub Area</label>
            <input
              name="subarea"
              value={form.subarea}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Sector No</label>
            <input
              name="sector_no"
              value={form.sector_no}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Road No</label>
            <input
              name="road_no"
              value={form.road_no}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">House No</label>
            <input
              name="house_no"
              value={form.house_no}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* ================= CONTACT ================= */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Contact Information (Owner Details) *
          </label>
          <textarea
            name="contact"
            value={form.contact}
            onChange={handleChange}
            rows={3}
            required
            className={inputClass}
            placeholder="Owner name & phone number"
          />
        </div>

        {/* ================= IMAGES ================= */}
        <h2 className="text-lg font-medium">Images</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* EXISTING IMAGES */}
          {existingImages.map((img) => (
            <div key={`old-${img.id}`} className="relative">
              <img
                src={`${IMAGE_BASE_URL}/${img.image_path}`}
                className="h-32 w-full object-cover rounded-lg"
              />

              <button
                type="button"
                onClick={() => handleRemoveImage(img.id)}
                className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded cursor-pointer"
              >
                Remove
              </button>
            </div>
          ))}

          {/* NEW IMAGES */}
          {newImages.map((img, index) => (
            <div key={`new-${index}`} className="relative">
              <img
                src={img.preview}
                className="h-32 w-full object-cover rounded-lg border border-dashed"
              />

              <button
                type="button"
                onClick={() => removeNewImage(index)}
                className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded cursor-pointer"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        {/* ADD NEW IMAGES */}
        <div className="border-2 border-dashed rounded-xl p-6 text-center bg-gray-50 hover:bg-gray-100 transition">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleNewImages}
            className="hidden"
            id="imageUpload"
          />
          <label htmlFor="imageUpload" className="cursor-pointer">
            <div className="inline-block px-4 py-2 bg-gray-800 text-white rounded-md">
              Browse Images
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Drag & drop or click (max 10 images)
            </p>
          </label>
        </div>

        {/* PRICE */}
        <h2 className="text-lg font-medium">Price</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block mb-1 font-medium">Price *</label>
            <div className="flex">
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Enter price"
                className="flex-1 border rounded-l-lg px-3 py-2 shadow-sm focus:outline-none"
                required
              />
              <span className="bg-gray-200 px-4 flex items-center rounded-r-lg">
                BDT
              </span>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Price Type</label>
            <select
              name="priceType"
              value={form.priceType}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="Monthly">Monthly</option>
              <option value="Weekly">Weekly</option>
              <option value="Daily">Daily</option>
            </select>
          </div>
        </div>

        {/* PRICE INCLUDES */}
        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
          <p className="font-medium mb-3">Price Includes</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { key: "electricity", label: "Electricity bill" },
              { key: "water", label: "Water bill" },
              { key: "security", label: "Security bill" },
              { key: "gas", label: "Gas bill" },
              { key: "lift", label: "Lift bill" },
            ].map((item) => (
              <div key={item.key} className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggle(item.key)}
                  className={`w-12 h-6 rounded-full flex items-center p-1 transition ${
                    form[item.key] ? "bg-orange-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transform ${
                      form[item.key] ? "translate-x-6" : ""
                    }`}
                  />
                </button>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/user/my-properties")}
            className="px-6 py-2 bg-gray-400 text-white rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500"
          >
            {submitting ? "Updating..." : "Update Property"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProperty;
