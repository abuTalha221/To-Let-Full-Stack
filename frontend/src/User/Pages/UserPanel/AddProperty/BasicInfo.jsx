import React from "react";
import { months, categories, numOptions } from "./constants";

const inputClass =
  "w-full border rounded-lg px-3 py-3 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-300 transition";

const BasicInfo = ({ form, onChange }) => {
  return (
    <>
      {/* TITLE */}
      <h1 className="text-2xl sm:text-3xl font-semibold mb-4">
        Create Post
      </h1>

      {/* NOTICE */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded mb-6">
        <p className="text-sm sm:text-base">
          দ্রুত ভাড়াটিয়া পাওয়ার জন্য সঠিক তথ্য ও স্পষ্ট ছবি সংযুক্ত করে ফর্মটি পূরণ করুন।
        </p>
      </div>

      {/* BASIC */}
      <h2 className="text-lg font-medium mb-3">
        Basic Information
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {/* Month */}
        <select
          name="monthId"
          value={form.monthId}
          onChange={onChange}
          className={inputClass}
        >
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        {/* Category */}
        <select
          name="primaryCategory"
          value={form.primaryCategory}
          onChange={onChange}
          className={inputClass}
        >
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        {/* Property Type */}
        <select
          name="propertyTypeId"
          value={form.propertyTypeId}
          onChange={onChange}
          className={inputClass}
        >
          <option value="">Property Type</option>
          <option value="Apartment">Apartment</option>
          <option value="Flat">Flat</option>
          <option value="House">House</option>
          <option value="Office">Office</option>
        </select>

        {/* Bedroom */}
        <select
          name="bedroom"
          value={form.bedroom}
          onChange={onChange}
          className={inputClass}
        >
          <option value="">Bedrooms</option>
          {numOptions(10).map((n) => (
            <option key={n.value} value={n.value}>
              {n.label}
            </option>
          ))}
        </select>

        {/* Bathroom */}
        <select
          name="bathroom"
          value={form.bathroom}
          onChange={onChange}
          className={inputClass}
        >
          <option value="">Bathrooms</option>
          {numOptions(10).map((n) => (
            <option key={n.value} value={n.value}>
              {n.label}
            </option>
          ))}
        </select>

        {/* Balcony */}
        <select
          name="balcony"
          value={form.balcony}
          onChange={onChange}
          className={inputClass}
        >
          <option value="">Balcony</option>
          {Array.from({ length: 11 }, (_, i) => i).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        {/* Floor */}
        <select
          name="floor"
          value={form.floor}
          onChange={onChange}
          className={inputClass}
        >
          <option value="">Floor</option>
          {numOptions(20).map((n) => (
            <option key={n.value} value={n.value}>
              {n.label}
            </option>
          ))}
        </select>

        {/* Gender */}
        <select
          name="gender"
          value={form.gender}
          onChange={onChange}
          className={inputClass}
        >
          <option value="">Gender</option>
          <option value="1">Only Male</option>
          <option value="2">Only Female</option>
          <option value="3">Both</option>
        </select>

        {/* Size */}
        <input
          name="size"
          value={form.size}
          onChange={onChange}
          placeholder="Size (sq ft)"
          className={inputClass}
        />
      </div>
    </>
  );
};

export default BasicInfo;
