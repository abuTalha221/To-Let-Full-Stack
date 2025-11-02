import React, { useState } from "react";
import Logo from "../../assets/logo.png";
import { FaCaretDown, FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router";

const menu = [
  { id: 1, name: "Home", link: "/" },
  { id: 2, name: "About", link: "/about" },
  { id: 3, name: "Services", link: "/services" },
  { id: 4, name: "Add Property", link: "/addproperty" },
  { id: 5, name: "Contact Us", link: "/contact" },
];

const DropdownLinks = [
  { id: 1, name: "All Properties", link: "/#" },
  { id: 2, name: "Dhaka Division", link: "/#" },
  { id: 3, name: "Chittagong Division", link: "/#" },
  { id: 4, name: "Khulna Division", link: "/#" },
  { id: 5, name: "Rajshahi Division", link: "/#" },
  { id: 6, name: "Barisal Division", link: "/#" },
  { id: 7, name: "Sylhet Division", link: "/#" },
  { id: 8, name: "Rangpur Division", link: "/#" },
  { id: 9, name: "Mymensingh Division", link: "/#" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200 fixed top-0 left-0 w-full z-50">
      <div className="relative mx-auto flex justify-between items-center py-0 px-4 md:px-20 lg:px-32">
        {/* Logo */}
        <a href="/">
          <img
            src={Logo}
            alt="Logo"
            className="w-[80px] h-[80px] object-contain"
          />
        </a>
        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-6 py-2">
          {menu.map((data) => (
            <li key={data.id}>
              <a
                href={data.link}
                className="inline-block px-4 hover:text-[#EC733B] hover:underline underline-offset-8 transition duration-200 ease-in-out"
              >
                {data.name}
              </a>
            </li>
          ))}
          <li className="group relative cursor-pointer">
            <a
              href="#"
              className="flex items-center gap-[2px] hover:text-[#EC733B] duration-200"
            >
              Property Lists
              <FaCaretDown className="transition-all duration-200 group-hover:rotate-180" />
            </a>
            <div className="absolute hidden group-hover:block w-[200px] rounded-md bg-white p-2 text-black shadow-md">
              <ul>
                {DropdownLinks.map((data) => (
                  <li key={data.id}>
                    <a
                      href={data.link}
                      className="inline-block w-full rounded-md p-2 hover:bg-[#EC733B]/20"
                    >
                      {data.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        </ul>

        {/* Desktop Buttons */}
        <div className="hidden md:flex gap-3 items-center">
          <button
            onClick={() => navigate("/register")}
            className="text-[#EC733B] px-6 py-2 border-2 border-[#EC733B] rounded-lg hover:bg-[#EC733B] hover:text-white transition duration-200 ease-in-out cursor-pointer"
          >
            Login/Register
          </button>
          <button
            onClick={() => navigate("/find-house")}
            className="text-white bg-[#EC733B] px-6 py-2 border-2 border-[#EC733B] rounded-lg transform transition duration-300 ease-in-out hover:translate-x-2 cursor-pointer"
          >
            Find House
          </button>
        </div>

        {/* Mobile Hamburger Button */}
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
        <div className="md:hidden bg-white dark:bg-gray-900 w-full shadow-md px-6 py-4 flex flex-col gap-4">
          {/* Mobile Links */}
          <ul className="flex flex-col gap-4">
            {menu.map((data) => (
              <li key={data.id}>
                <a
                  href={data.link}
                  className="block px-4 py-2 hover:text-[#EC733B]"
                >
                  {data.name}
                </a>
              </li>
            ))}
            <li className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-base font-medium group relative cursor-pointer">
                Property Lists{" "}
                <FaCaretDown className="transition-all duration-200 group-hover:rotate-180" />
              </div>
              <ul className="flex flex-col ml-4 gap-2">
                {DropdownLinks.map((data) => (
                  <li key={data.id}>
                    <a
                      href={data.link}
                      className="block px-4 py-1 text-sm hover:text-[#EC733B]"
                    >
                      {data.name}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          </ul>

          {/* Mobile Buttons */}
          <div className="flex flex-col gap-3 mt-4">
            <button className="text-[#EC733B] px-6 py-2 border-2 border-[#EC733B] rounded-lg hover:bg-[#EC733B] hover:text-white transition duration-200 ease-in-out">
              Login/Register
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/find-house");
              }}
              className="text-white bg-[#EC733B] px-6 py-2 border-2 border-[#EC733B] rounded-lg transform transition duration-300 ease-in-out hover:translate-x-2 cursor-pointer"
            >
              Find House
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
