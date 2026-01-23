import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api";
import PropertyCard from "../Components/PropertyCard";

const categoryLabel = {
  "1": "Family",
  "2": "Bachelor",
  "3": "Office",
  "4": "Sublet",
  "5": "Hostel",
};

const SearchResults = () => {
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [properties, setProperties] = useState([]);

  const area = params.get("area") || "";
  const subarea = params.get("subarea") || "";
  const category = params.get("category") || "";

  const heading = useMemo(() => {
    const parts = [];
    if (area) parts.push(area);
    if (category && categoryLabel[category]) parts.push(categoryLabel[category]);
    return parts.join(" > ");
  }, [area, category]);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/public-properties", {
          signal: controller.signal,
          params: {
            area: area || undefined,
            subarea: subarea || undefined,
            category: category || undefined,
          },
        });
        setProperties(res.data.properties || []);
      } catch (err) {
        if (err?.code === "ERR_CANCELED" || err?.name === "CanceledError") return;
        console.error("Search results fetch failed", err);
        setError("Failed to load search results. Please try again.");
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [area, subarea, category]);

  return (
    <div className="w-full bg-gray-100 min-h-screen py-12 mt-[70px]">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <p className="text-sm text-gray-500">Search</p>
          <h1 className="text-2xl font-semibold text-gray-800">{heading || "Results"}</h1>
          {(subarea || categoryLabel[category]) && (
            <p className="text-sm text-gray-600 mt-1">
              {subarea ? `Subarea: ${subarea}` : ""}
              {subarea && categoryLabel[category] ? " • " : ""}
              {categoryLabel[category] ? `Category: ${categoryLabel[category]}` : ""}
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="w-full h-52 bg-gray-300" />
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-2" />
                  <div className="h-3 bg-gray-300 rounded w-1/3 mb-1" />
                  <div className="h-3 bg-gray-300 rounded w-1/4 mb-1" />
                  <div className="h-3 bg-gray-300 rounded w-3/4 mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
            No properties found for this search.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;