// src/Admin/Pages/AdminLocationManager.jsx
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

/*
 Data shape stored in localStorage (tolet_locations):
 {
   divisions: [
     {
       id: "dhaka",
       name: "Dhaka",
       districts: [
         {
           id: "dhaka_city",
           name: "Dhaka",
           areas: [
             {
               id: "gulshan",
               name: "Gulshan",
               subareas: ["Gulshan-1", "Gulshan-2"]
             }
           ]
         }
       ]
     }
   ]
 }
*/

const STORAGE_KEY = "tolet_locations";

// small helper utilities
const uid = (prefix = "") => `${prefix}${Math.random().toString(36).slice(2, 9)}`;

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { divisions: [] };
    return JSON.parse(raw);
  } catch (e) {
    console.warn("load parse error", e);
    return { divisions: [] };
  }
}
function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const AdminLocationManager = () => {
  const [data, setData] = useState({ divisions: [] });

  // selection state for editing / add targets
  const [selDivId, setSelDivId] = useState("");
  const [selDistrictId, setSelDistrictId] = useState("");
  const [selAreaId, setSelAreaId] = useState("");

  // form states
  const [divisionName, setDivisionName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [areaName, setAreaName] = useState("");
  const [subareaName, setSubareaName] = useState("");

  useEffect(() => {
    setData(load());
  }, []);

  // persist to localStorage
  function persist(newData) {
    setData(newData);
    save(newData);
  }

  /* ---------- Division CRUD ---------- */
  function addDivision() {
    if (!divisionName.trim()) return Swal.fire("Validation", "Division name required", "warning");
    const newDiv = { id: uid("div_"), name: divisionName.trim(), districts: [] };
    const newData = { ...data, divisions: [...data.divisions, newDiv] };
    persist(newData);
    setDivisionName("");
    Swal.fire("Saved", "Division added", "success");
  }

  function removeDivision(id) {
    Swal.fire({
      title: "Delete division?",
      text: "This will remove all districts/areas/subareas under it.",
      icon: "warning",
      showCancelButton: true,
    }).then((res) => {
      if (!res.isConfirmed) return;
      const newData = { ...data, divisions: data.divisions.filter((d) => d.id !== id) };
      persist(newData);
      if (selDivId === id) {
        setSelDivId("");
        setSelDistrictId("");
        setSelAreaId("");
      }
      Swal.fire("Deleted", "", "success");
    });
  }

  /* ---------- District CRUD ---------- */
  function addDistrict() {
    if (!selDivId) return Swal.fire("Validation", "Select division first", "warning");
    if (!districtName.trim()) return Swal.fire("Validation", "District name required", "warning");
    const newDistrict = { id: uid("dist_"), name: districtName.trim(), areas: [] };
    const newData = { ...data, divisions: data.divisions.map(d => d.id === selDivId ? { ...d, districts: [...d.districts, newDistrict] } : d) };
    persist(newData);
    setDistrictName("");
    Swal.fire("Saved", "District added", "success");
  }

  function removeDistrict(id) {
    Swal.fire({ title: "Delete district?", icon: "warning", showCancelButton: true }).then(res => {
      if (!res.isConfirmed) return;
      const newData = {
        ...data,
        divisions: data.divisions.map(d => d.id === selDivId ? { ...d, districts: d.districts.filter(ds => ds.id !== id) } : d)
      };
      persist(newData);
      if (selDistrictId === id) setSelDistrictId("");
      Swal.fire("Deleted", "", "success");
    });
  }

  /* ---------- Area CRUD ---------- */
  function addArea() {
    if (!selDivId || !selDistrictId) return Swal.fire("Validation", "Select division & district first", "warning");
    if (!areaName.trim()) return Swal.fire("Validation", "Area name required", "warning");
    const newArea = { id: uid("area_"), name: areaName.trim(), subareas: [] };
    const newData = {
      ...data,
      divisions: data.divisions.map(d => {
        if (d.id !== selDivId) return d;
        return {
          ...d,
          districts: d.districts.map(ds => ds.id === selDistrictId ? { ...ds, areas: [...ds.areas, newArea] } : ds)
        };
      })
    };
    persist(newData);
    setAreaName("");
    Swal.fire("Saved", "Area added", "success");
  }

  function removeArea(id) {
    Swal.fire({ title: "Delete area?", icon: "warning", showCancelButton: true }).then(res => {
      if (!res.isConfirmed) return;
      const newData = {
        ...data,
        divisions: data.divisions.map(d => {
          if (d.id !== selDivId) return d;
          return {
            ...d,
            districts: d.districts.map(ds => ds.id === selDistrictId ? { ...ds, areas: ds.areas.filter(a => a.id !== id) } : ds)
          };
        })
      };
      persist(newData);
      if (selAreaId === id) setSelAreaId("");
      Swal.fire("Deleted", "", "success");
    });
  }

  /* ---------- Subarea CRUD ---------- */
  function addSubarea() {
    if (!selDivId || !selDistrictId || !selAreaId) return Swal.fire("Validation", "Select division / district / area first", "warning");
    if (!subareaName.trim()) return Swal.fire("Validation", "Subarea name required", "warning");
    const newSub = subareaName.trim();
    const newData = {
      ...data,
      divisions: data.divisions.map(d => {
        if (d.id !== selDivId) return d;
        return {
          ...d,
          districts: d.districts.map(ds => {
            if (ds.id !== selDistrictId) return ds;
            return {
              ...ds,
              areas: ds.areas.map(a => a.id === selAreaId ? { ...a, subareas: [...(a.subareas||[]), newSub] } : a)
            };
          })
        };
      })
    };
    persist(newData);
    setSubareaName("");
    Swal.fire("Saved", "Subarea added", "success");
  }

  function removeSubarea(name) {
    Swal.fire({ title: "Delete subarea?", icon: "warning", showCancelButton: true }).then(res => {
      if (!res.isConfirmed) return;
      const newData = {
        ...data,
        divisions: data.divisions.map(d => {
          if (d.id !== selDivId) return d;
          return {
            ...d,
            districts: d.districts.map(ds => {
              if (ds.id !== selDistrictId) return ds;
              return {
                ...ds,
                areas: ds.areas.map(a => a.id === selAreaId ? { ...a, subareas: a.subareas.filter(s => s !== name) } : a)
              };
            })
          };
        })
      };
      persist(newData);
      Swal.fire("Deleted", "", "success");
    });
  }

  /* ---------- Utility to export / reset ---------- */
  function exportJson() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tolet_locations.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
  function resetAll() {
    Swal.fire({
      title: "Reset all location data?",
      icon: "warning",
      showCancelButton: true,
    }).then(r => {
      if (!r.isConfirmed) return;
      const blank = { divisions: [] };
      persist(blank);
      setSelDivId(""); setSelDistrictId(""); setSelAreaId("");
      Swal.fire("Reset", "All location data removed", "success");
    });
  }

  // helpers to render lists
  const selectedDivision = data.divisions.find(d => d.id === selDivId);
  const selectedDistrict = selectedDivision?.districts?.find(ds => ds.id === selDistrictId);
  const selectedArea = selectedDistrict?.areas?.find(a => a.id === selAreaId);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-[#EC733B]">Admin — Locations Manager</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Left: Lists / selection */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Divisions</h3>
            <ul className="space-y-2">
              {data.divisions.map(d => (
                <li key={d.id} className="flex items-center justify-between">
                  <div>
                    <button className={`text-left ${selDivId === d.id ? "font-semibold" : ""}`} onClick={() => { setSelDivId(d.id); setSelDistrictId(""); setSelAreaId(""); }}>
                      {d.name}
                    </button>
                    <div className="text-xs text-gray-500">{d.districts?.length || 0} districts</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setDivisionName(d.name); /* allow edit by saving over: remove+add or implement edit later */ }} className="text-sm px-2 py-1 border rounded">Edit</button>
                    <button onClick={() => removeDivision(d.id)} className="text-sm px-2 py-1 border rounded text-red-600">Delete</button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex gap-2">
              <input placeholder="New division name" value={divisionName} onChange={e => setDivisionName(e.target.value)} className="flex-1 border p-2 rounded" />
              <button onClick={addDivision} className="px-4 py-2 bg-[#EC733B] text-white rounded">Add</button>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Districts (select division first)</h3>
            <div className="mb-2">
              <select value={selDivId} onChange={e => { setSelDivId(e.target.value); setSelDistrictId(""); setSelAreaId(""); }} className="w-full border p-2 rounded">
                <option value="">Select division</option>
                {data.divisions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>

            <ul className="space-y-2">
              {selectedDivision?.districts?.map(ds => (
                <li key={ds.id} className="flex items-center justify-between">
                  <div>
                    <button className={`${selDistrictId === ds.id ? "font-semibold" : ""}`} onClick={() => { setSelDistrictId(ds.id); setSelAreaId(""); }}>{ds.name}</button>
                    <div className="text-xs text-gray-500">{ds.areas?.length || 0} areas</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setDistrictName(ds.name); }} className="text-sm px-2 py-1 border rounded">Edit</button>
                    <button onClick={() => removeDistrict(ds.id)} className="text-sm px-2 py-1 border rounded text-red-600">Delete</button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex gap-2">
              <input placeholder="New district name" value={districtName} onChange={e => setDistrictName(e.target.value)} className="flex-1 border p-2 rounded" />
              <button onClick={addDistrict} className="px-4 py-2 bg-[#EC733B] text-white rounded">Add</button>
            </div>
          </div>
        </div>

        {/* Right: Areas & Subareas */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Areas (select district)</h3>

            <div className="mb-2">
              <select value={selDistrictId} onChange={e => { setSelDistrictId(e.target.value); setSelAreaId(""); }} className="w-full border p-2 rounded">
                <option value="">Select district</option>
                {selectedDivision?.districts?.map(ds => <option key={ds.id} value={ds.id}>{ds.name}</option>)}
              </select>
            </div>

            <ul className="space-y-2">
              {selectedDistrict?.areas?.map(a => (
                <li key={a.id} className="flex items-center justify-between">
                  <div>
                    <button className={`${selAreaId === a.id ? "font-semibold" : ""}`} onClick={() => setSelAreaId(a.id)}>{a.name}</button>
                    <div className="text-xs text-gray-500">{a.subareas?.length || 0} subareas</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setAreaName(a.name); }} className="text-sm px-2 py-1 border rounded">Edit</button>
                    <button onClick={() => removeArea(a.id)} className="text-sm px-2 py-1 border rounded text-red-600">Delete</button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex gap-2">
              <input placeholder="New area name" value={areaName} onChange={e => setAreaName(e.target.value)} className="flex-1 border p-2 rounded" />
              <button onClick={addArea} className="px-4 py-2 bg-[#EC733B] text-white rounded">Add</button>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Subareas (select area)</h3>

            <div className="mb-2">
              <select value={selAreaId} onChange={e => setSelAreaId(e.target.value)} className="w-full border p-2 rounded">
                <option value="">Select area</option>
                {selectedDistrict?.areas?.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>

            <ul className="space-y-2">
              {selectedArea?.subareas?.map((s, ix) => (
                <li key={ix} className="flex items-center justify-between">
                  <div>{s}</div>
                  <div><button onClick={() => removeSubarea(s)} className="text-sm px-2 py-1 border rounded text-red-600">Delete</button></div>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex gap-2">
              <input placeholder="New subarea name" value={subareaName} onChange={e => setSubareaName(e.target.value)} className="flex-1 border p-2 rounded" />
              <button onClick={addSubarea} className="px-4 py-2 bg-[#EC733B] text-white rounded">Add</button>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={exportJson} className="px-4 py-2 border rounded">Export JSON</button>
            <button onClick={resetAll} className="px-4 py-2 border rounded text-red-600">Reset All</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminLocationManager;
