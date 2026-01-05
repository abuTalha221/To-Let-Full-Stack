import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api";
import Swal from "sweetalert2";
import {
  FaBed,
  FaBath,
  FaLayerGroup,
  FaBuilding,
  FaRulerCombined,
  FaMale,
  FaMapMarkerAlt,
  FaPhone,
  FaCheckCircle,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

/* ---------- IMAGE BASE ---------- */
const IMAGE_BASE_URL = "http://localhost:8000/storage";

/* ---------- DATE FORMAT ---------- */
const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const ShowPost = () => {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewIndex, setPreviewIndex] = useState(null);

  useEffect(() => {
    if (previewIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        showPrev();
      }

      if (e.key === "ArrowRight") {
        showNext();
      }

      if (e.key === "Escape") {
        setPreviewIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [previewIndex, property]);

  useEffect(() => {
    fetchProperty();
  }, []);

  const fetchProperty = async () => {
    try {
      const res = await api.get(`/properties/${id}`);
      setProperty(res.data.property);
    } catch {
      Swal.fire("Error", "Property not found", "error");
    } finally {
      setLoading(false);
    }
  };

  const showPrev = () => {
    if (!property?.images?.length) return;

    setPreviewIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const showNext = () => {
    if (!property?.images?.length) return;

    setPreviewIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  if (loading) {
    return (
      <p className="text-center mt-20 text-gray-500 animate-pulse">
        Loading post...
      </p>
    );
  }

  if (!property) return null;

  // ---------- SHORT ADDRESS ----------
  const shortAddress = [
    property.house_no && `House No: ${property.house_no}/`,
    property.road_no && `Road No: ${property.road_no}/`,
    property.sector_no && `Sector No: ${property.sector_no}`,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="max-w-5xl mx-auto p-25 space-y-6 mt-5">
      {/* TITLE */}
      <div className="bg-white rounded-xl shadow p-5">
        <h1 className="text-lg font-bold text-orange-600">{property.title}</h1>
      </div>

      {/* IMAGES */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="font-semibold mb-3 text-orange-600">Images</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {property.images.map((img, index) => (
            <img
              key={img.id}
              src={`${IMAGE_BASE_URL}/${img.image_path}`}
              className="h-32 w-full object-cover rounded cursor-pointer"
              onClick={() => setPreviewIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* BASIC INFO */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="font-semibold mb-3 text-orange-600">
          Basic Information
        </h2>

        <div className="flex flex-wrap gap-12 text-sm">
          <div className="flex items-center gap-2">
            <FaBed /> {property.bedroom} Bedroom
          </div>
          <div className="flex items-center gap-2">
            <FaBath /> {property.bathroom} Bathroom
          </div>
          <div className="flex items-center gap-2">
            <FaLayerGroup /> Balcony: {property.balcony ?? "-"}
          </div>
          <div className="flex items-center gap-2">
            <FaBuilding /> Floor: {property.floor ?? "-"}
          </div>
          <div className="flex items-center gap-2">
            <FaRulerCombined /> {property.size ?? "-"} sqft
          </div>
          <div className="flex items-center gap-2">
            <FaMale /> Gender:
            {property.gender === 1
              ? " Male"
              : property.gender === 2
              ? " Female"
              : " Both"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-5 py-4 text-sm bg-white rounded-xl shadow p-5">
        <div>
          <p className="text-gray-400">PROPERTY ID</p>
          <p className="font-medium">{property.id}</p>
        </div>

        <div>
          <p className="text-gray-400">AVAILABLE FROM</p>
          <p className="font-medium">{property.monthText}</p>
        </div>

        <div>
          <p className="text-gray-400">CATEGORY</p>
          <p className="font-medium">{property.categoryText}</p>
        </div>

        <div>
          <p className="text-gray-400">PROPERTY TYPE</p>
          <p className="font-medium">{property.property_type}</p>
        </div>
      </div>

      {/* LOCATION */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="font-semibold mb-3 flex items-center gap-2 text-orange-600">
          <FaMapMarkerAlt /> Location
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          <div>
            <p className="text-gray-400">Division</p>
            <p>{property.division}</p>
          </div>
          <div>
            <p className="text-gray-400">District</p>
            <p>{property.district}</p>
          </div>
          <div>
            <p className="text-gray-400">Area</p>
            <p>{property.area}</p>
          </div>
          <div>
            <p className="text-gray-400">Sub Area</p>
            <p>{property.subarea ?? "-"}</p>
          </div>
        </div>
      </div>

      {/* PRICE */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="font-semibold text-orange-600">Price</h2>
        <p className="text-2xl font-bold text-orange-600">৳ {property.price}</p>
        <p className="text-sm text-gray-500">{property.price_type}</p>
      </div>

      {/* PRICE INCLUDES */}
      {(property.gas ||
        property.water ||
        property.lift ||
        property.security ||
        property.electricity) && (
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="font-semibold mb-2 flex items-center gap-2 text-orange-600">
            Price Includes
          </h2>

          <ul className="text-sm space-y-1">
            {property.gas === 1 && (
              <li className="flex items-center gap-2">
                {" "}
                <FaCheckCircle className="text-green-500" />
                Gas Bill
              </li>
            )}
            {property.water === 1 && (
              <li className="flex items-center gap-2">
                {" "}
                <FaCheckCircle className="text-green-500" /> Water Bill
              </li>
            )}
            {property.lift === 1 && (
              <li className="flex items-center gap-2">
                {" "}
                <FaCheckCircle className="text-green-500" /> Lift Bill
              </li>
            )}
            {property.security === 1 && (
              <li className="flex items-center gap-2">
                {" "}
                <FaCheckCircle className="text-green-500" /> Security Bill
              </li>
            )}
            {property.electricity === 1 && (
              <li className="flex items-center gap-2">
                {" "}
                <FaCheckCircle className="text-green-500" />
                Electricity Bill
              </li>
            )}
          </ul>
        </div>
      )}

      {/* SHORT ADDRESS (WILL BE LOCKED LATER) */}
      <div className="bg-white rounded-xl shadow p-5 border border-orange-200">
        <h2 className="font-semibold mb-2 text-orange-600">Short Address</h2>

        {shortAddress ? (
          <p className="text-gray-800 font-medium">{shortAddress}</p>
        ) : (
          <p className="text-gray-400 italic">Address not available</p>
        )}

        {/* FUTURE LOCK NOTE */}
        <p className="text-xs text-gray-500 mt-2">
          🔒 This address will be locked for general users.
        </p>
      </div>

      {/* CONTACT */}
      <div className="bg-white rounded-xl shadow p-5 border border-orange-200">
        <h2 className="font-semibold mb-2 text-orange-600">Contact</h2>
        <div className="flex items-center gap-2">
          <FaPhone /> {property.contact}
        </div>
      </div>

      {/* FULL IMAGE PREVIEW */}
      {previewIndex !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <button
            onClick={() => setPreviewIndex(null)}
            className="absolute top-6 right-6 text-white text-2xl"
          >
            <FaTimes />
          </button>

          <button
            onClick={showPrev}
            className="absolute left-6 text-white text-3xl"
          >
            <FaChevronLeft />
          </button>

          <img
            src={`${IMAGE_BASE_URL}/${property.images[previewIndex].image_path}`}
            className="max-w-[90%] max-h-[90%] rounded-lg"
          />

          <button
            onClick={showNext}
            className="absolute right-6 text-white text-3xl"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default ShowPost;
