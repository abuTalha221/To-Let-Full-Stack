import React, { useState } from 'react';

const districtData = {
  Dhaka: ["Dhanmondi", "Gulshan", "Banani", "Mirpur", "Uttara", "Mohammadpur", "Badda"],
  Chattogram: ["Agrabad", "Pahartali", "Panchlaish", "Halishahar", "Kotwali"],
  Khulna: ["Sonadanga", "Khalishpur", "Daulatpur", "Boyra"],
  Rajshahi: ["Shaheb Bazar", "Motihar", "Sopura"],
  Barishal: ["Nathullabad", "C&B Road", "Band Road"],
  Sylhet: ["Zindabazar", "Amberkhana", "Uposhohor"],
  Rangpur: ["Jahaj Company More", "Pairabondh", "Mahiganj"],
  Mymensingh: ["Ganginarpar", "Choto Bazaar", "Kewatkhali"],
  Cumilla: ["Kandirpar", "Tomchom Bridge", "Race Course"],
  Narayanganj: ["Chashara", "Fatullah", "Shiddhirganj"],
  Gazipur: ["Tongi", "Chowrasta", "Board Bazar"],
  Bogura: ["Satmatha", "Charmatha", "Thanthania"],
  Noakhali: ["Maijdee", "Chowmuhani", "Begumganj"],
  Pabna: ["Hemayetpur", "Ishwardi", "Chhatiani"],
  Jessore: ["Manihar", "Chowgacha", "Benapole"],
  Patuakhali: ["Sadar", "Kuakata", "Kalapara"],
  CoxsBazar: ["Laboni Beach", "Sugandha Point", "Kolatoli Beach"],
};

const SearchProperty = ({ onSearch }) => {
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [areaList, setAreaList] = useState([]);

  const handleDistrictChange = (e) => {
    const district = e.target.value;
    setSelectedDistrict(district);
    setSelectedArea('');
    setAreaList(districtData[district] || []);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedDistrict && selectedArea) {
      onSearch(selectedDistrict, selectedArea);
    }
  };

  return (
    <div className="w-full py-12 mt-10">
      <div className="container mx-auto px-4">
        
        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Find Your Rental Property Easily
          </h2>
          <p className="text-gray-500 mt-2">
            Select your district, area, and property type to search
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">

            {/* District Dropdown */}
            <select
              value={selectedDistrict}
              onChange={handleDistrictChange}
              className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none"
            >
              <option value="">Select District</option>
              {Object.keys(districtData).map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>

            {/* Area Dropdown */}
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              disabled={!selectedDistrict}
              className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none"
            >
              <option value="">Select Area</option>
              {areaList.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>

            {/* Property Type Dropdown */}
            <select
              className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none"
            >
              <option value="">Select Property Type</option>
              <option value="Family House">Family House</option>
              <option value="Bachelor House">Bachelor House</option>
              <option value="Office Space">Office Space</option>
              <option value="Sublet">Sublet</option>
              <option value="Shop House">Shop House</option>
            </select>

            {/* Find Button */}
            <button
              type="submit"
              className="bg-[#EC733B] hover:bg-[#e45716] text-white font-semibold rounded px-6 py-2 transition cursor-pointer "
            >
              Find
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchProperty;
