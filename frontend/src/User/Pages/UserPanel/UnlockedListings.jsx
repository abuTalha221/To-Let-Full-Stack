import React, { useEffect, useState } from "react";
import api from "../../../api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import PlaceholderImg from "../../../assets/placeholder.svg";

const IMAGE_BASE_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api").replace(/\/api\/?$/, "") + "/storage";

const UnlockedListings = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await api.get("/user/unlocked");
      setProperties(res.data.properties || []);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load unlocked listings", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-12 text-gray-500">Loading unlocked listings...</p>;
  }

  if (!properties.length) {
    return (
      <div className="p-6">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Unlocked Listings</h2>
        <div className="text-center text-gray-500 mt-10">
          You haven’t unlocked any listings yet.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-extrabold text-gray-800">Unlocked Listings</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => {
          const image = property.images?.[0]?.image_path;
          const imgSrc = image ? `${IMAGE_BASE_URL}/${image}` : PlaceholderImg;

          // short address
          const shortAddress = [
            property.house_no && `House No: ${property.house_no}`,
            property.road_no && `Road No: ${property.road_no}`,
            property.sector_no && `Sector No: ${property.sector_no}`,
          ]
            .filter(Boolean)
            .join("/ ");

          return (
            <div key={property.id} className="bg-white rounded-lg shadow p-4">
              <img src={imgSrc} alt={property.title} className="w-full h-48 object-cover rounded" />

              <div className="mt-3">
                <h3 className="font-semibold text-lg text-[#e45716]">{property.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{property.area}, {property.district}</p>

                <div className="text-sm text-gray-700 mt-3">
                  <p><strong>Short Address:</strong> {shortAddress || "-"}</p>
                  <p className="mt-1"><strong>Contact:</strong> {property.contact || "-"}</p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button onClick={() => navigate(`/property-post/${property.id}`)} className="px-4 py-2 bg-[#e45716] text-white rounded">View Post</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UnlockedListings;
