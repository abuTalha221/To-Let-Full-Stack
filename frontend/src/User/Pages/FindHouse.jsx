// FindHouse.jsx
import React, { useState, useMemo } from "react";

/**
 * FindHouse.jsx
 * - Frontend-only search page for houses.
 * - Uses a small mock dataset so you can try filters immediately.
 * - Tailwind CSS for styling; make sure Tailwind is configured in your project.
 */

/* ---------- helper static lists ---------- */
const dhakaAreas = [
  "Adabor","Airport","Badda","Banani","Bangshal","Bhashantek","Cantonment",
  "Chawkbazar","Darussalam","Daskhinkhan","Demra","Dhamrai","Dhanmondi","Dohar",
  "Gandaria","Gulshan","Hazaribag","Jatrabari","Kafrul","Kalabagan","Kamrangirchar",
  "Keraniganj","Khilgaon","Khilkhet","Kotwali","Lalbag","Mirpur","Mohammadpur",
  "Motijheel","Mugda","Nawabganj","New Market","Others","Pallabi","Paltan",
  "Purbachal","Ramna","Rampura","Rupnagar","Sabujbag","Savar","Shah Ali","Shahbag",
  "Shahjahanpur","Sher-E-Bangla Nagar","Shyampur","Sutrapur","Tejgaon","Tejgaon I/A",
  "Turag","Uttara","Uttarkhan","Vatara","Wari",
];

const categories = ["Family", "Bachelor", "Office", "Sublet", "Hostel"];

/* ---------- small mock dataset (frontend only) ---------- */
/* Add / edit items here to test more combinations */
const mockProperties = [
  {
    id: 1,
    title: "3 bed flat near Dhanmondi Lake",
    area: "Dhanmondi",
    subarea: "Road 27",
    price: 45000,
    bedrooms: 3,
    bathrooms: 2,
    category: "Family",
    postedAt: "2025-11-10",
    img: "https://via.placeholder.com/600x360?text=Dhanmondi+1",
  },
  {
    id: 2,
    title: "1 bed bachelor flat in Uttara Sector 7",
    area: "Uttara",
    subarea: "Sector 7",
    price: 12000,
    bedrooms: 1,
    bathrooms: 1,
    category: "Bachelor",
    postedAt: "2025-12-01",
    img: "https://via.placeholder.com/600x360?text=Uttara+1",
  },
  {
    id: 3,
    title: "Office space in Gulshan 2",
    area: "Gulshan",
    subarea: "Gulshan 2",
    price: 120000,
    bedrooms: 0,
    bathrooms: 2,
    category: "Office",
    postedAt: "2025-10-05",
    img: "https://via.placeholder.com/600x360?text=Gulshan+Office",
  },
  {
    id: 4,
    title: "2 bed nicely renovated in Banani",
    area: "Banani",
    subarea: "Road 15",
    price: 35000,
    bedrooms: 2,
    bathrooms: 2,
    category: "Family",
    postedAt: "2025-12-08",
    img: "https://via.placeholder.com/600x360?text=Banani+2",
  },
  {
    id: 5,
    title: "Affordable studio near Mirpur-1",
    area: "Mirpur",
    subarea: "Mirpur 1",
    price: 8000,
    bedrooms: 1,
    bathrooms: 1,
    category: "Bachelor",
    postedAt: "2025-11-20",
    img: "https://via.placeholder.com/600x360?text=Mirpur+Studio",
  },
  {
    id: 6,
    title: "Large family house in Rampura",
    area: "Rampura",
    subarea: "Banasree",
    price: 70000,
    bedrooms: 4,
    bathrooms: 3,
    category: "Family",
    postedAt: "2025-11-05",
    img: "https://via.placeholder.com/600x360?text=Rampura+House",
  },
  {
    id: 7,
    title: "Cheap room in Tejgaon (shared)",
    area: "Tejgaon",
    subarea: "Farmgate",
    price: 5000,
    bedrooms: 1,
    bathrooms: 1,
    category: "Hostel",
    postedAt: "2025-12-05",
    img: "https://via.placeholder.com/600x360?text=Tejgaon+Room",
  },
  {
    id: 8,
    title: "Modern flat in Uttara West (Sector 2)",
    area: "Uttara",
    subarea: "Sector 2",
    price: 22000,
    bedrooms: 2,
    bathrooms: 2,
    category: "Family",
    postedAt: "2025-12-09",
    img: "https://via.placeholder.com/600x360?text=Uttara+Flat",
  },
  // ... you can add more items for testing
];

/* ---------- FindHouse component ---------- */
const FindHouse = () => {
  // filter state
  const [keyword, setKeyword] = useState("");
  const [area, setArea] = useState("");
  const [subarea, setSubarea] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // Clear filters
  const clearFilters = () => {
    setKeyword("");
    setArea("");
    setSubarea("");
    setMinPrice("");
    setMaxPrice("");
    setBedrooms("");
    setBathrooms("");
    setCategory("");
    setSortBy("newest");
    setPage(1);
  };

  // Derived filtered results
  const filtered = useMemo(() => {
    let list = mockProperties.slice(); // copy

    // keyword search (title / area / subarea)
    if (keyword.trim()) {
      const k = keyword.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(k) ||
          p.area.toLowerCase().includes(k) ||
          (p.subarea && p.subarea.toLowerCase().includes(k))
      );
    }

    // area
    if (area) list = list.filter((p) => p.area === area);

    // subarea (manual text)
    if (subarea.trim()) {
      const s = subarea.trim().toLowerCase();
      list = list.filter((p) => (p.subarea || "").toLowerCase().includes(s));
    }

    // price
    if (minPrice !== "") {
      const m = Number(minPrice || 0);
      list = list.filter((p) => Number(p.price) >= m);
    }
    if (maxPrice !== "") {
      const M = Number(maxPrice || 0);
      if (M > 0) list = list.filter((p) => Number(p.price) <= M);
    }

    // bedrooms & bathrooms
    if (bedrooms) list = list.filter((p) => Number(p.bedrooms) === Number(bedrooms));
    if (bathrooms) list = list.filter((p) => Number(p.bathrooms) === Number(bathrooms));

    // category
    if (category) list = list.filter((p) => p.category === category);

    // sort
    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else {
      // newest (by postedAt descending)
      list.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
    }

    return list;
  }, [keyword, area, subarea, minPrice, maxPrice, bedrooms, bathrooms, category, sortBy]);

  // paging
  const total = filtered.length;
  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  // helpers
  function prevPage() {
    setPage((p) => Math.max(1, p - 1));
  }
  function nextPage() {
    setPage((p) => Math.min(lastPage, p + 1));
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Find House</h1>
        <p className="text-sm text-gray-600">Search property listings — try the filters or type a keyword.</p>
      </div>

      {/* SEARCH / FILTER AREA */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            placeholder="Search by title, area or subarea..."
            value={keyword}
            onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
            className="col-span-1 md:col-span-2 w-full border rounded px-3 py-2 focus:ring-2 focus:ring-orange-300"
          />

          <select
            value={area}
            onChange={(e) => { setArea(e.target.value); setPage(1); }}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">All Areas (Dhaka)</option>
            {dhakaAreas.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>

          <input
            placeholder="Sub-area (type)"
            value={subarea}
            onChange={(e) => { setSubarea(e.target.value); setPage(1); }}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-3">
          <input
            type="number"
            placeholder="Min price (BDT)"
            value={minPrice}
            onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
            className="w-full border rounded px-3 py-2"
            min={0}
          />
          <input
            type="number"
            placeholder="Max price (BDT)"
            value={maxPrice}
            onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
            className="w-full border rounded px-3 py-2"
            min={0}
          />
          <select
            value={bedrooms}
            onChange={(e) => { setBedrooms(e.target.value); setPage(1); }}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Any bedrooms</option>
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
          </select>

          <select
            value={bathrooms}
            onChange={(e) => { setBathrooms(e.target.value); setPage(1); }}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Any bathrooms</option>
            {[1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
          </select>

          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">All categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="newest">Sort: Newest</option>
            <option value="price-asc">Sort: Price low → high</option>
            <option value="price-desc">Sort: Price high → low</option>
          </select>
        </div>

        <div className="flex items-center justify-between gap-3 mt-4">
          <div className="text-sm text-gray-700">
            <strong>{total}</strong> result{total !== 1 ? "s" : ""} found
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearFilters}
              className="text-sm px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100"
            >
              Clear filters
            </button>
          </div>
        </div>
      </div>

      {/* RESULTS */}
      <div>
        {total === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-lg font-medium">No properties found</p>
            <p className="text-sm text-gray-500 mt-2">Try clearing filters or changing keyword</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pageItems.map((p) => (
                <article key={p.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                  <div className="relative">
                    <img src={p.img} alt={p.title} className="w-full h-44 object-cover" />
                    <div className="absolute top-2 left-2 bg-white/75 text-xs px-2 py-1 rounded">{p.category}</div>
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">BDT {p.price.toLocaleString()}</div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium mb-1">{p.title}</h3>
                    <div className="text-sm text-gray-600">{p.area} • {p.subarea}</div>
                    <div className="mt-2 flex items-center text-sm text-gray-700 gap-3">
                      <div>{p.bedrooms} bd</div>
                      <div>{p.bathrooms} ba</div>
                      <div className="text-xs text-gray-500">Posted: {p.postedAt}</div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <button
                        onClick={() => alert(`View details for property id ${p.id} (no backend connected)`)}
                        className="text-sm px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-500"
                      >
                        View
                      </button>
                      <button
                        onClick={() => alert(`Saved property id ${p.id} to favorites (demo)`)}
                        className="text-sm px-2 py-1 border rounded"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* pagination */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} of {total}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={prevPage}
                  disabled={page === 1}
                  className={`px-3 py-1 rounded ${page === 1 ? "bg-gray-100 text-gray-400" : "bg-white border hover:bg-gray-50"}`}
                >
                  Prev
                </button>
                <div className="px-3 py-1 border rounded bg-white">Page {page} / {lastPage}</div>
                <button
                  onClick={nextPage}
                  disabled={page === lastPage}
                  className={`px-3 py-1 rounded ${page === lastPage ? "bg-gray-100 text-gray-400" : "bg-white border hover:bg-gray-50"}`}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FindHouse;
