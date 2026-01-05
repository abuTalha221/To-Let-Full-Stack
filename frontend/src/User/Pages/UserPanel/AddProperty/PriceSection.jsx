import React from "react";

const inputClass =
  "w-full border rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition";

const PriceSection = ({ form, onChange, toggle }) => {
  return (
    <>
      {/* PRICE */}
      <h2 className="text-lg font-medium mt-6 mb-3">Price</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Price */}
        <div>
          <label className="block mb-1 font-medium">Price *</label>
          <div className="flex">
            <input
              name="price"
              value={form.price}
              onChange={onChange}
              placeholder="Enter price"
              className="flex-1 border rounded-l-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <span className="bg-gray-200 px-4 flex items-center rounded-r-lg">
              BDT
            </span>
          </div>
        </div>

        {/* Price Type */}
        <div>
          <label className="block mb-1 font-medium">Price Type</label>
          <select
            name="priceType"
            value={form.priceType}
            onChange={onChange}
            className={inputClass}
          >
            <option value="Monthly">Monthly</option>
            <option value="Weekly">Weekly</option>
            <option value="Daily">Daily</option>
          </select>
        </div>
      </div>

      {/* PRICE INCLUDES */}
      <div className="mt-4 p-3 border rounded-lg bg-gray-50">
        <p className="font-medium mb-2">Price Includes</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                className={`w-12 h-6 rounded-full flex items-center p-1 transition cursor-pointer ${
                  form[item.key] ? "bg-orange-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transform transition ${
                    form[item.key] ? "translate-x-6" : ""
                  }`}
                />
              </button>

              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PriceSection;
