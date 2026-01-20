import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPhone, FaEnvelope, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Logo from "../../assets/logo.png"

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Contact', path: '/contact' },
  ];

  const propertyLinks = [
    { label: 'All Properties', path: '/properties' },
    { label: 'Dhaka Division', path: '/properties?region=dhaka' },
    { label: 'Chittagong Division', path: '/properties?region=chittagong' },
    { label: 'Khulna Division', path: '/properties?region=khulna' },
    { label: 'Sylhet Division', path: '/properties?region=sylhet' },
  ];

  const socialLinks = [
    { icon: <FaFacebookF />, label: 'Facebook', url: '#' },
    { icon: <FaTwitter />, label: 'Twitter', url: '#' },
    { icon: <FaInstagram />, label: 'Instagram', url: '#' },
    { icon: <FaLinkedinIn />, label: 'LinkedIn', url: '#' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <img src={Logo} alt="To-Let Logo" className="w-32 h-32 object-contain" />
            </div>
            <p className="text-sm leading-relaxed text-gray-400 mb-6">
              Your trusted platform for finding perfect properties. Quality service, professional support, and verified listings.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  aria-label={social.label}
                  className="w-10 h-10 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition duration-300 transform hover:scale-110"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center">
              <span className="w-1 h-6 bg-orange-500 mr-3 rounded-full"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-sm text-gray-400 hover:text-orange-500 transition flex items-center group"
                  >
                    <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Categories */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center">
              <span className="w-1 h-6 bg-orange-500 mr-3 rounded-full"></span>
              Property Lists
            </h3>
            <ul className="space-y-3">
              {propertyLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-sm text-gray-400 hover:text-orange-500 transition flex items-center group"
                  >
                    <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center">
              <span className="w-1 h-6 bg-orange-500 mr-3 rounded-full"></span>
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <FaMapMarkerAlt className="text-orange-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-sm text-gray-400 group-hover:text-orange-500 transition">
                  123 Main Street<br/>Dhaka, Bangladesh
                </span>
              </li>
              <li className="flex items-center group">
                <FaPhone className="text-orange-500 mr-3 flex-shrink-0" />
                <a href="tel:+880123456890" className="text-sm text-gray-400 hover:text-orange-500 transition">
                  +880 1234 567890
                </a>
              </li>
              <li className="flex items-center group">
                <FaEnvelope className="text-orange-500 mr-3 flex-shrink-0" />
                <a href="mailto:tolet@gmail.com" className="text-sm text-gray-400 hover:text-orange-500 transition">
                  tolet@gmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {currentYear} To-Let - Find Your Home. All rights reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-orange-500 transition">Privacy Policy</a>
            <a href="#" className="hover:text-orange-500 transition">Terms & Conditions</a>
            <a href="#" className="hover:text-orange-500 transition">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
