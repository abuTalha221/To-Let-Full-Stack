import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
let DefaultIcon = L.icon({
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: 23.8103,
  lng: 90.4125,
};

const generateNearbyHouses = (centerLat, centerLng) => {
  const houses = [];
  for (let i = 1; i <= 6; i++) {
    const randomLat = centerLat + (Math.random() - 0.5) * 0.02;
    const randomLng = centerLng + (Math.random() - 0.5) * 0.02;
    const randomPrice = Math.floor(10000 + Math.random() * 40000); // 10k to 50k BDT range
    houses.push({
      id: i,
      lat: randomLat,
      lng: randomLng,
      title: `House ${i}`,
      address: `Street ${i}, Nearby Area`,
      price: `৳${randomPrice.toLocaleString()} / month`,
    });
  }
  return houses;
};


const FindHouse = () => {
  const [mapCenter, setMapCenter] = useState(center);
  const [searchText, setSearchText] = useState("");
  const [nearbyHouses, setNearbyHouses] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}`
      );
      const data = await response.json();
      if (data.length > 0) {
        const location = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
        setMapCenter(location);

        // Generate nearby houses dynamically
        const houses = generateNearbyHouses(location.lat, location.lng);
        setNearbyHouses(houses);

        setShowSuggestions(true);
      } else {
        alert("Location not found");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  return (
    <div className="p-4">
      {/* Search Bar */}
      <div className="flex items-center space-x-2 mb-4 mt-18">
        <input
          type="text"
          placeholder="Enter location"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-orange-500 text-white p-2 rounded hover:bg-orange-600"
        >
          Search
        </button>
      </div>

      {/* Map */}
      <MapContainer center={[mapCenter.lat, mapCenter.lng]} zoom={14} style={containerStyle}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* Center Marker */}
        <Marker position={[mapCenter.lat, mapCenter.lng]}>
          <Popup>Your Searched Location</Popup>
        </Marker>

        {/* Nearby Houses Markers */}
        {nearbyHouses.map((house) => (
          <Marker key={house.id} position={[house.lat, house.lng]}>
            <Popup>{house.title}</Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* House Suggestions */}
      {showSuggestions && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Similar Houses Nearby</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {nearbyHouses.map((house) => (
              <div
                key={house.id}
                className="border rounded-lg shadow p-4 hover:shadow-lg transition duration-300"
              >
                <h3 className="text-xl font-bold mb-2">{house.title}</h3>
                <p className="text-gray-600 mb-1">{house.address}</p>
                <p className="text-green-600 font-semibold">{house.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FindHouse;
