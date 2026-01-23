import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

const ShowPost = () => {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewIndex, setPreviewIndex] = useState(null);
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(0);
  const [isOwner, setIsOwner] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  // Fetch current user (if authenticated)
  const fetchMe = async () => {
    try {
      const res = await api.get("/user");
      // API returns { status: true, user: {...} }
      const me = res.data?.user ?? res.data;
      setUser(me);
      setCredits(me?.credits ?? 0);
      return me;
    } catch {
      setUser(null); // not logged in
      return null;
    }
  };

  // Check whether the current user is the owner and whether this property info is unlocked
  const fetchUnlockStatus = async () => {
    try {
      const res = await api.get(`/properties/${id}/unlock-status`);
      setIsOwner(res.data.is_owner);
      setIsUnlocked(res.data.is_unlocked);
      // server may return current user's credits as well
      if (res.data.credits != null) setCredits(res.data.credits);
    } catch {
      // ignore
    }
  };

  const navigate = useNavigate();

  // Attempt to unlock contact/short address (costs 10 credits)
  const unlockInfo = async () => {
    if (credits < 10) {
      Swal.fire(
        "Not enough credits",
        "Unlocking information requires 10 credits.",
        "warning"
      );
      return;
    }

    setUnlocking(true);
    try {
      await api.post(`/properties/${id}/unlock`);
      Swal.fire("Unlocked", "Information unlocked successfully", "success");
      setCredits((c) => c - 10);
      setIsUnlocked(true);
    } catch (err) {
      // If server responded, show its message and handle common cases
      if (err?.response) {
        const { status, data } = err.response;

        if (status === 401) {
          Swal.fire({
            title: "Login Required",
            text: data?.message || "Please login to unlock information.",
            icon: "warning",
            confirmButtonText: "Go to Login",
            confirmButtonColor: "#e45716",
          }).then((r) => {
            if (r.isConfirmed) navigate("/login");
          });
        } else if (status === 403) {
          // Not enough credits on server-side
          const message = data?.message || "Not enough credits";
          Swal.fire({
            title: "Unable to unlock",
            text: `${message}. You can purchase credits to proceed.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Buy Credits",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#e45716",
          }).then((r) => {
            if (r.isConfirmed) navigate("/user/credits");
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data?.message || "Failed to unlock information",
            confirmButtonColor: "#e45716",
          });
        }
      } else {
        Swal.fire("Error", "Failed to unlock information", "error");
      }
    } finally {
      setUnlocking(false);
    }
  };

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
    (async () => {
      // Load property first
      const prop = await fetchProperty();

      // Load user
      const me = await fetchMe();

      // fetchUnlockStatus requires auth; it will be ignored for unauthenticated users
      await fetchUnlockStatus();

      // Fallback: if server didn't provide ownership info, compute locally using fetched values
      // Compare as strings to avoid number/string mismatches from API
      if (prop && me && String(prop.user_id) === String(me.id)) {
        setIsOwner(true);
        setIsUnlocked(true);
      }
    })();
  }, [id]);

  const fetchProperty = async () => {
    try {
      //const res = await api.get(`/properties/${id}`);
      const res = await api.get(`/public-properties/${id}`);

      setProperty(res.data.property);
      return res.data.property;
    } catch {
      Swal.fire({
        icon: "error",
        title: "Property Not Found",
        text: "The property you're looking for doesn't exist or has been removed.",
        confirmButtonText: "Back to Home",
        confirmButtonColor: "#e45716",
      }).then(() => {
        navigate("/");
      });
      return null;
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
    property.house_no && `House No: ${property.house_no}`,
    property.road_no && `Road No: ${property.road_no}`,
    property.sector_no && `Sector No: ${property.sector_no}`,
  ]
    .filter(Boolean)
    .join("/ ");

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 lg:p-10 space-y-6 mt-20 md:mt-5">
      <h1 className="text-xl md:text-2xl font-bold text-orange-600 mb-2">
        {property.categoryText}
      </h1>
      {/* TITLE */}
      <div className="bg-white rounded-xl shadow p-4 md:p-5">
        <h1 className="text-base md:text-lg font-bold text-orange-600">{property.title}</h1>
      </div>

      {/* IMAGES */}
      <div className="bg-white rounded-xl shadow p-4 md:p-5">
        <h2 className="font-semibold mb-3 text-orange-600">Images</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
          {property.images.map((img, index) => (
            <img
              key={img.id}
              src={`${IMAGE_BASE_URL}/${img.image_path}`}
              alt={`${property.title} - image ${index + 1}`}
              loading="lazy"
              className="h-32 w-full object-cover rounded cursor-pointer"
              onClick={() => setPreviewIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* BASIC INFO */}
      <div className="bg-white rounded-xl shadow p-4 md:p-5">
        <h2 className="font-semibold mb-3 text-orange-600">
          Basic Information
        </h2>

        <div className="flex flex-wrap gap-4 md:gap-8 lg:gap-12 text-xs md:text-sm">
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 px-4 md:px-5 py-4 text-xs md:text-sm bg-white rounded-xl shadow">
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
      <div className="bg-white rounded-xl shadow p-4 md:p-5">
        <h2 className="font-semibold mb-3 flex items-center gap-2 text-orange-600">
          <FaMapMarkerAlt /> Location
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 text-xs md:text-sm">
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
      <div className="bg-white rounded-xl shadow p-4 md:p-5">
        <h2 className="font-semibold text-orange-600">Price</h2>
        <p className="text-xl md:text-2xl font-bold text-orange-600">৳ {property.price}</p>
        <p className="text-xs md:text-sm text-gray-500">{property.price_type}</p>
      </div>

      {/* PRICE INCLUDES */}
      {(property.gas ||
        property.water ||
        property.lift ||
        property.security ||
        property.electricity) && (
        <div className="bg-white rounded-xl shadow p-4 md:p-5">
          <h2 className="font-semibold mb-2 flex items-center gap-2 text-orange-600">
            Price Includes
          </h2>

          <ul className="text-xs md:text-sm space-y-1">
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

        {isOwner || isUnlocked ? (
          <p className="font-medium">{shortAddress}</p>
        ) : (
          <p className="text-gray-400 italic">
            Short Address Locked information
          </p>
        )}
      </div>

      {/* CONTACT */}
      <div className="bg-white rounded-xl shadow p-5 border border-orange-200">
        <h2 className="font-semibold mb-2 text-orange-600">Contact</h2>

        {(isOwner || isUnlocked) && (
          <div className="flex items-center gap-2">
            <FaPhone /> {property.contact}
          </div>
        )}

        {!user && (
          <div className="text-xs md:text-sm text-gray-600 space-y-3">
            <p>
              Please login for show the contact information. Please log in or
              register to view the full property details. We protect the privacy
              of owners and do not share contact information with unregistered
              users.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => (window.location.href = "/login")}
                className="px-4 py-2 bg-orange-600 text-white rounded text-sm"
              >
                Login
              </button>

              <button
                onClick={() => (window.location.href = "/register")}
                className="px-4 py-2 border border-orange-600 text-orange-600 rounded text-sm"
              >
                Register
              </button>
            </div>
          </div>
        )}

        {user && !isOwner && !isUnlocked && (
          <div className="text-xs md:text-sm text-gray-600 space-y-3">
            <p>
              Unlocking information requires <b>10 credits</b>.
            </p>

            {credits < 10 ? (
              <div className="space-y-3">
                <p className="text-red-600">
                  You do not have enough credits to unlock information. Unlocking
                  information requires <b>10 credits</b>. You can purchase credits
                  via Card, Mobile banking, or Net banking.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigate('/user/credits')}
                    className="px-4 py-2 bg-green-600 text-white rounded text-sm"
                  >
                    Buy Credits
                  </button>

                  <button
                    onClick={() => navigate('/user/credits')}
                    className="px-4 py-2 border border-orange-600 text-orange-600 rounded text-sm"
                  >
                    See Plans
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={unlockInfo}
                disabled={unlocking}
                className="px-4 py-2 bg-orange-600 text-white rounded text-sm w-full sm:w-auto"
              >
                {unlocking ? "Unlocking..." : "Unlock Information"}
              </button>
            )}
          </div>
        )}
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
            alt={`${property.title} - image ${previewIndex + 1}`}
            loading="lazy"
            className="max-w-[90%] max-h-[90%] rounded-lg"
          />

          <p className="absolute bottom-6 text-white text-sm">
            {previewIndex + 1} / {property.images.length}
          </p>

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
