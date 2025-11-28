import React, { useState } from "react";
import SidePanel from "./sidepanel/SidePanel";
import { Outlet } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import FaceMonitor from "./faceMoniiter/FaceMonitor";

const Home = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen relative">

      {/* ===== Mobile Hamburger Button ===== */}
      <button
        className="md:hidden absolute top-4 left-4 z-50 p-2 bg-gray-200 rounded-lg shadow"
        onClick={() => setOpen(!open)}
      >
        <FaBars size={22} />
      </button>

      {/* ===== Sidebar ===== */}
      <div
        className={`
          fixed md:static
          top-0 left-0 h-full w-64 bg-gray-100 border-r border-gray-300 p-4 
          overflow-y-auto z-40 shadow-lg
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >

        <SidePanel />
      </div>

      {/* ===== Overlay (Mobile) ===== */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50  z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ===== Main Content ===== */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </div>

      <div className="fixed right-0 bottom-0">
        <FaceMonitor></FaceMonitor>
      </div>
    </div>
  );
};

export default Home;
