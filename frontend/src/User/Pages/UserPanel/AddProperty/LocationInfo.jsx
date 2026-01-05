import React from "react";
import { dhakaAreas } from "./constants";

const inputClass =
  "w-full border rounded-lg px-3 py-3 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-300 transition";

const LocationInfo = ({ form, onChange }) => {
  return (
    <>
      {/* LOCATION */}
      <h2 className="text-lg font-medium mt-6 mb-3">
        Location Information
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {/* Division */}
        <input
          value="Dhaka"
          disabled
          className={`${inputClass} bg-gray-100`}
        />

        {/* District */}
        <input
          value="Dhaka"
          disabled
          className={`${inputClass} bg-gray-100`}
        />

        {/* Area */}
        <select
          name="area"
          value={form.area}
          onChange={onChange}
          className={inputClass}
        >
          <option value="">Select Area</option>
          {dhakaAreas.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        {/* Sub-area */}
        <input
          name="subarea"
          value={form.subarea}
          onChange={onChange}
          placeholder="Sub-area (type manually)"
          className={inputClass}
        />

        {/* Sector */}
        <input
          name="sector_no"
          value={form.sector_no}
          onChange={onChange}
          placeholder="Sector No"
          className={inputClass}
        />

        {/* Road */}
        <input
          name="road_no"
          value={form.road_no}
          onChange={onChange}
          placeholder="Road No"
          className={inputClass}
        />

        {/* House */}
        <input
          name="house_no"
          value={form.house_no}
          onChange={onChange}
          placeholder="House No"
          className={inputClass}
        />

        {/* Short Address */}
        <div className="sm:col-span-2 md:col-span-3">
          <label className="block mb-1 font-medium">
             Contact information (Mention Owner Details here)
            <span className="text-red-500"> *</span>
          </label>

          <textarea
            name="contact"
            value={form.contact}
            onChange={onChange}
            rows={3}
            required
            placeholder="Owner: Mr. Rahman, 01XXXXXXXXX"
            className="w-full border rounded-lg px-3 py-2 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
          />
        </div>
      </div>
    </>
  );
};

export default LocationInfo;
