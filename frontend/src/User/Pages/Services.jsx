import React from "react";
import { FaHome, FaGraduationCap, FaBuilding, FaSearch, FaCheckCircle, FaHeadset, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const navigate = useNavigate();
  
  const services = [
    {
      id: 1,
      title: "Home Rentals",
      description:
        "Find family-friendly houses and apartments in secure and convenient locations.",
      icon: <FaHome className="text-4xl text-orange-500" />,
      features: ["Verified landlords", "Safe neighborhoods", "Flexible terms"]
    },
    {
      id: 2,
      title: "Bachelor Accommodations",
      description:
        "Affordable and convenient rental spaces for students and working professionals.",
      icon: <FaGraduationCap className="text-4xl text-orange-500" />,
      features: ["Budget-friendly", "Near colleges & offices", "Furnished options"]
    },
    {
      id: 3,
      title: "Office & Business Spaces",
      description:
        "Expand your business with ready-to-move office spaces available at prime locations.",
      icon: <FaBuilding className="text-4xl text-orange-500" />,
      features: ["Prime locations", "Flexible lease", "Modern facilities"]
    },
    {
      id: 4,
      title: "Property Search Assistance",
      description:
        "We help you search and find properties that best match your specific needs and budget.",
      icon: <FaSearch className="text-4xl text-orange-500" />,
      features: ["Personalized search", "Expert advice", "Fast results"]
    },
    {
      id: 5,
      title: "Verified Listings",
      description:
        "All our listings are verified to ensure a secure and trustworthy rental or purchase experience.",
      icon: <FaCheckCircle className="text-4xl text-orange-500" />,
      features: ["100% verified", "Photo gallery", "Instant booking"]
    },
    {
      id: 6,
      title: "Customer Support",
      description:
        "Our support team is available to assist you with any inquiries or help throughout your journey.",
      icon: <FaHeadset className="text-4xl text-orange-500" />,
      features: ["24/7 availability", "Multi-language", "Quick response"]
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6 mt-18">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto mb-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            We offer comprehensive solutions to help you find the perfect place to live, work, or invest with confidence and ease.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-2xl transition duration-300 group cursor-pointer transform hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-orange-100 p-4 rounded-lg group-hover:bg-orange-200 transition">
                  {service.icon}
                </div>
                <FaArrowRight className="text-orange-500 opacity-0 group-hover:opacity-100 transition" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3 group-hover:text-orange-600 transition">
                {service.title}
              </h2>
              <p className="text-gray-600 mb-4">{service.description}</p>
              
              {/* Features list */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Key Features:</h3>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto mt-20 bg-white rounded-xl shadow-md p-12 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Get Started?</h2>
        <p className="text-gray-600 text-lg mb-8">
          Explore our services today and find the perfect property that matches your needs.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate("/properties")}
            className="bg-gradient-to-r from-[#EC733B] to-[#e45716] hover:scale-105 duration-300 text-white py-3 px-8 rounded-full font-semibold"
          >
            Browse Properties
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="border-2 border-[#EC733B] text-[#EC733B] hover:bg-[#EC733B] hover:text-white duration-300 py-3 px-8 rounded-full font-semibold"
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default Services;
