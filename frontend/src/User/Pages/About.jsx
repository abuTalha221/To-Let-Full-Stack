import React from "react";
import { FaStar, FaCheck, FaLock, FaClock, FaHeadset, FaMobile, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; 

const About = () => {
  const navigate = useNavigate(); 

  const features = [
    { icon: <FaLock className="text-2xl text-orange-500" />, title: "Secure Transactions", desc: "Safe and encrypted property deals" },
    { icon: <FaClock className="text-2xl text-orange-500" />, title: "Quick Process", desc: "Find your perfect home in minutes" },
    { icon: <FaHeadset className="text-2xl text-orange-500" />, title: "24/7 Support", desc: "Dedicated customer support team" },
    { icon: <FaMobile className="text-2xl text-orange-500" />, title: "Easy to Use", desc: "User-friendly mobile & web platform" },
  ];


  const steps = [
    { step: 1, title: "Search", desc: "Browse through thousands of verified properties" },
    { step: 2, title: "Connect", desc: "Message landlords and verify property details" },
    { step: 3, title: "Secure", desc: "Complete secure payment and documentation" },
    { step: 4, title: "Move In", desc: "Get keys and start your new chapter" },
  ];

  const reviews = [
    {
      name: "Nazmus Sakib",
      rating: 5,
      comment: "Fantastic service! I found my dream apartment within a week. The team was super helpful!",
    },
    {
      name: "Nahid Hasan",
      rating: 4,
      comment: "Highly recommend for commercial spaces. Smooth process and excellent support!",
    },
    {
      name: "Priya Das",
      rating: 5,
      comment: "User-friendly platform. Renting a house has never been this easy!",
    },
    {
      name: "Rafiq Ahmed",
      rating: 4,
      comment: "Safe, simple, and fast. I loved the regular property updates!",
    },
    {
      name: "রাহুল চৌধুরী",
      rating: 5,
      comment: "খুব দ্রুত এবং নিরাপদভাবে আমার বাসা খুঁজে পেয়েছি। ধন্যবাদ আপনাদের টিমকে!",
    },
    {
      name: "মেহরাব হাসান",
      rating: 4,
      comment: "প্ল্যাটফর্মটি ব্যবহার করা সহজ এবং পরিষেবাও খুব ভালো। আমি খুবই সন্তুষ্ট।",
    },
    {
      name: "Sofia Khan",
      rating: 5,
      comment: "Super easy to navigate and the listings are updated regularly. Excellent experience!",
    },
    {
      name: "Masud Rana",
      rating: 5,
      comment: "Customer support is top-notch. They answered all my queries patiently. Highly recommend!",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-10 mt-18">
     
      <section className="max-w-6xl mx-auto mb-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-12 text-white shadow-lg">
        <h1 className="text-5xl font-bold mb-4">Welcome to To-Let</h1>
        <p className="text-xl opacity-90">Your trusted platform for finding the perfect home, office, or commercial space</p>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-6xl mx-auto mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To simplify the property rental process and connect property seekers with verified landlords. We believe finding a home should be easy, safe, and transparent.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To become the leading property platform in the region, trusted by millions for secure, convenient, and hassle-free rental experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Why Choose To-Let?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition text-center">
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md">
              <div className="bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">What Our Customers Say</h2>
        <p className="text-center text-gray-500 text-lg mb-12">Real experiences from our happy clients around the world 🌎</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-2xl transition duration-300 group"
            >
              <div className="flex items-center mb-4">
                <div className="bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                  {review.name[0]}
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-800">{review.name}</h4>
                  <div className="flex">
                    {Array.from({ length: 5 }, (_, i) => (
                      <FaStar
                        key={i}
                        className={`transition ${
                          i < review.rating ? "text-yellow-400 group-hover:scale-110" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 group-hover:text-gray-800 transition">{review.comment}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Us */}
      <section className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-8 mb-8">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">About To-Let</h2>
        <p className="text-gray-600 text-lg leading-relaxed mb-4">
          We are committed to helping you find homes, offices, and commercial spaces easily, safely, and quickly. Our goal is to provide a reliable and user-friendly platform where you can rent or purchase properties that meet your needs.
        </p>
        <p className="text-gray-600 text-lg leading-relaxed mb-4">
          With constantly updated property listings, secure transactions, and dedicated customer support, we strive to deliver the best service to all our users.
        </p>
        <p className="text-gray-600 text-lg leading-relaxed mb-4">
          Whether you're a first-time renter, an experienced landlord, or a business owner looking for office space, To-Let is your trusted partner in finding the perfect property.
        </p>
        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          Join thousands of happy users today and find the perfect place for your dream home or growing business!
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
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
      </section>
    </div>
  );
};

export default About;
