import React from "react";
import { Link } from "react-router-dom";
import { BiBed } from "react-icons/bi";
import { FaBath } from "react-icons/fa";
import { AiOutlineCheckCircle } from "react-icons/ai";
import PlaceholderImg from "../../assets/placeholder.svg";

const APP_BASE = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api").replace(/\/api\/?$/, "");
const IMAGE_BASE_URL = `${APP_BASE}/storage`;

const formatPrice = (val) => {
  if (val == null) return "N/A";
  try {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    }).format(val);
  } catch {
    return `${val} BDT`;
  }
};

const PropertyCard = ({ property }) => {
  const image = property.images?.[0]?.image_path;
  const imgSrc = image ? `${IMAGE_BASE_URL}/${image}` : PlaceholderImg;
  const altText = property.title || `${property.area || ""}, ${property.district || ""}`;

  return (
    <div
      className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition transform hover:scale-[1.02]"
    >
      {/* IMAGE / TO-LET */}
      <div className="relative">
        <img
          src={imgSrc}
          alt={altText}
          loading="lazy"
          className="w-full h-56 object-cover"
        />

        {/* PRICE BADGE */}
        <div className="absolute top-3 left-3 bg-[#EC733B] text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md transform transition-all group-hover:scale-105">
          {formatPrice(property.price)}
        </div>

        {/* TO-LET RIBBON */}
        <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
          TO-LET
        </div>
      </div>

      {/* DETAILS */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-[#EC733B]">
            {property.categoryText} {property.property_type} Rent
          </h3>
          {(property.verified || property.is_verified || property.isVerified) && (
            <span className="flex items-center text-green-600 text-sm font-medium gap-1" title="Verified">
              <AiOutlineCheckCircle />
              Verified
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
          <span className="flex items-center gap-1">
            <BiBed className="text-lg" /> {property.bedroom}
          </span>
          <span className="flex items-center gap-1">
            <FaBath className="text-lg" /> {property.bathroom}
          </span>
          <span className="text-sm text-gray-500 ml-auto">
            To-let from: <em>{property.monthText}</em>
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          {property.area}, {property.district}
        </p>

        {/* VIEW BUTTON */}
        <Link
          to={`/property-post/${property.id}`}
          aria-label={`View details for property ${property.id}`}
          className="w-full block text-center bg-[#EC733B] text-white py-2 rounded hover:bg-[#d45e28] transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EC733B]"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
