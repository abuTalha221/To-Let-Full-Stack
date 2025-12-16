import React, { useState } from "react";
import { Link } from "react-router-dom";

/**
 * MyProperties.jsx
 * Beginner-friendly, self-contained UI for "My Properties" page.
 * - Breadcrumb header + Submit Property button
 * - Tabs (All / Active / Deactivated)
 * - Search input
 * - Filters panel toggle (simple UI only)
 * - Active filter badges area
 * - Table placeholder + empty state with actions
 *
 * No backend calls. Replace the dummy `items` array with real API data later.
 */

const MyProperties = () => {
  // UI state
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'active' | 'deactivated'
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [hasImagesFilter, setHasImagesFilter] = useState(false);
  const [unlockedFilter, setUnlockedFilter] = useState(false);

  // Demo items list (empty -> shows empty state). Replace with real data later.
  const items = []; // e.g. [{ id:1, title:'House A', status:'active' }, ...]

  // derived filtered list (very simple client-side filter)
  const filtered = items.filter((it) => {
    if (activeTab === "active" && it.status !== "active") return false;
    if (activeTab === "deactivated" && it.status !== "deactivated") return false;
    if (search && !it.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (hasImagesFilter && !it.hasImages) return false;
    if (unlockedFilter && !it.unlocked) return false;
    return true;
  });

  // Apply / reset filter functions (simple)
  function applyFilters() {
    setFiltersOpen(false);
  }
  function resetFilters() {
    setHasImagesFilter(false);
    setUnlockedFilter(false);
  }

  return (
    <div className="p-6 md:p-10">
      {/* Header section */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          {/* Breadcrumbs */}
          <nav className="mb-2 text-sm text-gray-600" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li>
                <Link to="/user-panel" className="text-blue-600 hover:underline">
                  Posts
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                  <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </li>
              <li className="text-gray-800 font-medium">List</li>
            </ol>
          </nav>

          <h1 className="text-2xl font-bold">Posts</h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/user-panel/properties/create" // change if your create route differs
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-md shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Submit Property
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        {/* Tabs */}
        <div className="mb-4 border-b">
          <div className="flex gap-2">
            {["all", "active", "deactivated"].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={
                  "px-4 py-2 -mb-px border-b-2 " +
                  (activeTab === t
                    ? "border-orange-500 text-orange-600 font-semibold"
                    : "border-transparent text-gray-600 hover:text-gray-800")
                }
              >
                {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Search + Filters toolbar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <div className="flex items-center gap-3 w-full md:w-1/2">
            <div className="relative w-full">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="w-full px-3 py-2 border rounded-md"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                  aria-label="Clear"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setFiltersOpen((v) => !v)}
                className="px-3 py-2 border rounded-md inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                  <path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 0 1 .628.74v2.288a2.25 2.25 0 0 1-.659 1.59l-4.682 4.683a2.25 2.25 0 0 0-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 0 1 8 18.25v-5.757a2.25 2.25 0 0 0-.659-1.591L2.659 6.22A2.25 2.25 0 0 1 2 4.629V2.34a.75.75 0 0 1 .628-.74Z" clipRule="evenodd" />
                </svg>
                Filters
                <span className="ml-1 text-xs text-gray-600">(2)</span>
              </button>

              {/* Filters panel (simple) */}
              {filtersOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border rounded-md shadow-lg p-3 z-20">
                  <div className="mb-2 font-medium">Filters</div>

                  <label className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={hasImagesFilter}
                      onChange={(e) => setHasImagesFilter(e.target.checked)}
                    />
                    Has images
                  </label>

                  <label className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={unlockedFilter}
                      onChange={(e) => setUnlockedFilter(e.target.checked)}
                    />
                    Unlocked Posts
                  </label>

                  <div className="flex gap-2 mt-3">
                    <button onClick={applyFilters} className="px-3 py-1 bg-orange-600 text-white rounded-md">
                      Apply
                    </button>
                    <button onClick={resetFilters} className="px-3 py-1 border rounded-md">
                      Reset
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick actions or export (placeholder) */}
            <button className="px-3 py-2 border rounded-md">Export</button>
          </div>
        </div>

        {/* Active filter badges */}
        <div className="mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {/* example badge for Country filter */}
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              Country: Bangladesh
              <button
                onClick={() => {
                  // remove country filter (example)
                }}
                className="ml-2 text-blue-700"
                aria-label="Remove"
              >
                ✕
              </button>
            </div>

            {hasImagesFilter && (
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                Has images
                <button onClick={() => setHasImagesFilter(false)} className="ml-2">✕</button>
              </div>
            )}

            {unlockedFilter && (
              <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                Unlocked
                <button onClick={() => setUnlockedFilter(false)} className="ml-2">✕</button>
              </div>
            )}
          </div>
        </div>

        {/* Table / Content area */}
        <div>
          {/* If no items, show empty state similar to example */}
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 rounded-full bg-orange-50 flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"></path>
                </svg>
              </div>

              <h2 className="text-xl font-semibold mb-2">You haven’t submitted any property yet.</h2>
              <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                Post your property now and connect with verified tenants. Reach thousands of interested renters without brokers or extra commission.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="/article/looking-for-tenant-post-empty-house"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 rounded-md"
                >
                  Learn More
                </a>

                <a
                  href="/contact-us"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md"
                >
                  Contact Us
                </a>

                <Link to="/user-panel/properties/create" className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-md">
                  Submit Property
                </Link>
              </div>
            </div>
          ) : (
            // Replace with actual table later
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-2">Title</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((it) => (
                    <tr key={it.id} className="border-b">
                      <td className="py-2">{it.title}</td>
                      <td className="py-2">{it.status}</td>
                      <td className="py-2">
                        <Link to={`/user-panel/properties/${it.id}/edit`} className="text-blue-600 hover:underline">
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProperties;
