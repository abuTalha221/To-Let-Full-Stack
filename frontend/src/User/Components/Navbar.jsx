import React, { useState, useEffect } from "react";
import Logo from "../../assets/logo.png";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import api from "../../api";
import SearchModal from "./SearchModal"; 

const menu = [
  { id: 1, name: "Home", link: "/" },
  { id: 2, name: "About", link: "/about" },
  { id: 3, name: "Services", link: "/services" },
  { id: 4, name: "Add Property", link: "/addproperty" },
  { id: 6, name: "Order Home", link: "/order-home" },
  { id: 5, name: "Contact Us", link: "/contact" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false); 

  const token = localStorage.getItem("auth_token");

  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleProtectedNavigation = async (name, link) => {
    if (!token) {
      const result = await Swal.fire({
        title: "Login Required",
        text: `You need to log in to access ${name}.`,
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Go to Login",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#e45716",
      });

      if (result.isConfirmed) navigate("/login");
      return;
    }
    navigate(link);
  };

 
  const handleModalNavigate = (url) => {
    setSearchOpen(false);
    try {
      window.location.href = url;
    } catch (err) {
      navigate(url);
    }
  };

  return (
    <>
      <nav className="shadow-md bg-white dark:bg-gray-900 dark:text-white fixed top-0 left-0 w-full z-50 transition-all">
        <div className="flex justify-between items-center py-2 px-4 md:px-10 lg:px-20">
          <a href="/" className="flex items-center gap-2">
            <img
              src={Logo}
              alt="Logo"
              className="w-[85px] h-[85px] md:w-[80px] md:h-[80px] object-contain"
            />
          </a>

          <ul className="hidden md:flex items-center gap-6">
            {menu.map((data) => (
              <li key={data.id}>
                {(data.name === "Add Property" || data.name === "Order Home") ? (
                  <button
                    onClick={() => handleProtectedNavigation(data.name, data.link)}
                    className="inline-block px-2 hover:text-[#EC733B] hover:underline underline-offset-8 transition cursor-pointer bg-transparent border-none"
                  >
                    {data.name}
                  </button>
                ) : (
                  <a
                    href={data.link}
                    className="inline-block px-2 hover:text-[#EC733B] hover:underline underline-offset-8 transition"
                  >
                    {data.name}
                  </a>
                )}
              </li>
            ))}
          </ul>

          <div className="hidden md:flex gap-4 items-center">
            {!token ? (
              <button
                onClick={() => navigate("/register")}
                className="text-[#EC733B] px-6 py-2 border-2 border-[#EC733B] rounded-lg hover:bg-[#EC733B] hover:text-white transition cursor-pointer"
              >
                Login/Register
              </button>
            ) : (
              <button
                onClick={() => navigate("/user-panel")}
                className="flex items-center gap-2 text-[#EC733B]"
              >
                <FaUserCircle className="text-3xl" />
                <span className="font-semibold hidden sm:inline cursor-pointer">
                  {user?.name}
                </span>
              </button>
            )}

            <button
              onClick={() => setSearchOpen(true)}
              className="text-white bg-[#EC733B] px-6 py-2 border-2 border-[#EC733B] rounded-lg transform transition hover:translate-x-2 cursor-pointer"
            >
              Find House
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#EC733B] focus:outline-none text-2xl"
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 px-6 py-4 space-y-4 shadow-lg border-t border-gray-200 dark:border-gray-700">
            {menu.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (item.name === "Add Property" || item.name === "Order Home") {
                    handleProtectedNavigation(item.name, item.link);
                  } else {
                    navigate(item.link);
                  }
                }}
                className="block text-lg text-left w-full hover:text-[#EC733B] transition cursor-pointer bg-transparent border-none"
              >
                {item.name}
              </button>
            ))}

            <hr className="border-gray-300 dark:border-gray-700" />

            {!token ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/register");
                }}
                className="w-full text-center bg-[#EC733B] text-white py-2 rounded-lg cursor-pointer"
              >
                Login / Register
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/user-panel");
                }}
                className="flex items-center gap-2 w-full text-[#EC733B]"
              >
                <FaUserCircle className="text-3xl" />
                <span className="font-semibold cursor-pointer">{user?.name}</span>
              </button>
            )}

            {/* Mobile Find House -> open modal */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#EC733B] text-white py-2 rounded-lg hover:bg-[#d9652e] transition cursor-pointer"
            >
              Find House
            </button>
          </div>
        )}
      </nav>

      {/* Search Modal (controlled) */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={handleModalNavigate}
      />
    </>
  );
};

export default Navbar;
