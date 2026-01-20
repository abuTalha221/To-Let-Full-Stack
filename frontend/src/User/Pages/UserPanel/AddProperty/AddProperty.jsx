import React, { useState } from "react";
import Swal from "sweetalert2";
import api from "../../../../api";

import BasicInfo from "./BasicInfo";
import LocationInfo from "./LocationInfo";
import PriceSection from "./PriceSection";
import ImagesUpload from "./ImagesUpload";

const AddProperty = () => {
  /* ---------------- FORM STATE ---------------- */
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

    area: "",
    subarea: "",
    sector_no: "",
    road_no: "",
    house_no: "",
    contact: "",

    price: "",
    priceType: "Monthly",

    electricity: false,
    water: false,
    security: false,
    gas: false,
    lift: false,
  });

  /* ---------------- IMAGES STATE ---------------- */
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const maxFiles = 10;

  /* ---------------- IMAGE HANDLERS ---------------- */
  const handleFilesSelected = (fileList) => {
    if (!fileList) return;

    const files = Array.from(fileList).filter((f) =>
      allowedTypes.includes(f.type)
    );

    const remaining = maxFiles - images.length;
    if (remaining <= 0) return;

    const toAdd = files.slice(0, remaining).map((file) => ({
      file,
      url: URL.createObjectURL(file),
      id: crypto.randomUUID(),
      loaded: false,
    }));

    setImages((prev) => [...prev, ...toAdd]);
  };

  const onInputChange = (e) => {
    handleFilesSelected(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFilesSelected(e.dataTransfer.files);
  };

  const handleImageLoaded = (id) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, loaded: true } : img
      )
    );
  };

  const removeImage = (index) => {
    try {
      URL.revokeObjectURL(images[index].url);
    } catch {}
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* ---------------- FORM HANDLERS ---------------- */
  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const toggle = (key) =>
    setForm((s) => ({ ...s, [key]: !s[key] }));

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirm = await Swal.fire({
      icon: "question",
      title: "Confirm Property Post",
      text: "20 credits will be deducted from your account",
      showCancelButton: true,
      confirmButtonColor: "#e45716",
      confirmButtonText: "Confirm",
    });

    if (!confirm.isConfirmed) return;

    setLoading(true);

    try {
      const formData = new FormData();

      // append form fields
      Object.entries(form).forEach(([key, value]) => {
        if (typeof value === "boolean") {
          formData.append(key, value ? 1 : 0);
        } else if (value !== "") {
          formData.append(key, value);
        }
      });

      // append images
      images.forEach((img) => {
        formData.append("images[]", img.file);
      });

      await api.post("/properties", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire("Success", "Property posted successfully", "success");

      // reset form
      setForm({
        monthId: "",
        primaryCategory: "",
        propertyTypeId: "",
        bedroom: "",
        bathroom: "",
        balcony: "",
        floor: "",
        gender: "",
        size: "",
        area: "",
        subarea: "",
        sector_no: "",
        road_no: "",
        house_no: "",
        contact: "",
        price: "",
        priceType: "Monthly",
        electricity: false,
        water: false,
        security: false,
        gas: false,
        lift: false,
      });

      setImages([]);

    } catch (error) {
      Swal.fire(
        "Submission Failed",
        error.response?.data?.message || "Server error",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 md:p-6 rounded-xl shadow"
      >
        <BasicInfo form={form} onChange={handleChange} />
        <LocationInfo form={form} onChange={handleChange} />

        <ImagesUpload
          images={images}
          onInputChange={onInputChange}
          handleDrop={handleDrop}
          handleImageLoaded={handleImageLoaded}
          removeImage={removeImage}
        />

        <PriceSection
          form={form}
          onChange={handleChange}
          toggle={toggle}
        />

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-semibold text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-500"
            }`}
          >
            {loading ? "Submitting..." : "Submit Property"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProperty;
