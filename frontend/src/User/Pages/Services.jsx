import React from "react";

const Services = () => {
  const services = [
    {
      id: 1,
      title: "Home Rentals",
      description:
        "Find family-friendly houses and apartments in secure and convenient locations.",
      icon: "🏠",
    },
    {
      id: 2,
      title: "Bachelor Accommodations",
      description:
        "Affordable and convenient rental spaces for students and working professionals.",
      icon: "👨‍🎓",
    },
    {
      id: 3,
      title: "Office & Business Spaces",
      description:
        "Expand your business with ready-to-move office spaces available at prime locations.",
      icon: "🏢",
    },
    {
      id: 4,
      title: "Property Search Assistance",
      description:
        "We help you search and find properties that best match your specific needs and budget.",
      icon: "🔍",
    },
    {
      id: 5,
      title: "Verified Listings",
      description:
        "All our listings are verified to ensure a secure and trustworthy rental or purchase experience.",
      icon: "✅",
    },
    {
      id: 6,
      title: "Customer Support",
      description:
        "Our support team is available to assist you with any inquiries or help throughout your journey.",
      icon: "💬",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6 mt-18">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Services</h1>
        <p className="text-gray-600 text-lg mb-12">
          We offer a range of services to help you find the perfect place to live, work, or invest.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition duration-300"
            >
              <div className="text-5xl mb-4">{service.icon}</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {service.title}
              </h2>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
