import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import Logo from "../../assets/logo.png" // Your existing logo

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-10 pb-6 px-6 md:px-20 lg:px-32">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Logo and Description */}
        <div>
          <img src={Logo} alt="Logo" className="w-30 h-30 object-contain mb-4" />
          <p className="text-sm">
            Find your perfect property with us. Quality service, professional support, and trusted listings.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li><a href="/" className="hover:text-[#EC733B]">Home</a></li>
            <li><a href="/about" className="hover:text-[#EC733B]">About</a></li>
            <li><a href="/#" className="hover:text-[#EC733B]">Services</a></li>
            <li><a href="/#" className="hover:text-[#EC733B]">Pricing</a></li>
            <li><a href="/#" className="hover:text-[#EC733B]">Contact Us</a></li>
          </ul>
        </div>

        {/* Property Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Property Lists</h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li><a href="/#" className="hover:text-[#EC733B]">All Properties</a></li>
            <li><a href="/#" className="hover:text-[#EC733B]">Dhaka Division</a></li>
            <li><a href="/#" className="hover:text-[#EC733B]">Chittagong Division</a></li>
            <li><a href="/#" className="hover:text-[#EC733B]">Khulna Division</a></li>
            <li><a href="/#" className="hover:text-[#EC733B]">More...</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact Us</h3>
          <p className="text-sm mb-2">Email: info@example.com</p>
          <p className="text-sm mb-4">Phone: +880 1234 567890</p>

          {/* Social Media Icons */}
          <div className="flex gap-4 mt-2">
            <a href="#" className="hover:text-[#EC733B]"><FaFacebookF /></a>
            <a href="#" className="hover:text-[#EC733B]"><FaTwitter /></a>
            <a href="#" className="hover:text-[#EC733B]"><FaInstagram /></a>
            <a href="#" className="hover:text-[#EC733B]"><FaLinkedinIn /></a>
          </div>
        </div>

      </div>

      {/* Bottom Line */}
      <div className="text-center text-sm text-gray-500 mt-10">
        &copy; {new Date().getFullYear()} ABC MultiNational. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
