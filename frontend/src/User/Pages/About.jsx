import React from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // <-- Import navigate

const About = () => {
  const navigate = useNavigate(); // <-- Initialize navigate function

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
      name: "Carlos H.",
      rating: 5,
      comment: "Customer support is top-notch. They answered all my queries patiently. Highly recommend!",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-18">
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
      <section className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">About Us</h1>
        <p className="text-gray-600 text-lg leading-relaxed mb-4">
          We are committed to helping you find homes, offices, and commercial spaces easily, safely, and quickly. Our goal is to provide a reliable and user-friendly platform where you can rent or purchase properties that meet your needs.
        </p>
        <p className="text-gray-600 text-lg leading-relaxed mb-4">
          With constantly updated property listings, secure transactions, and dedicated customer support, we strive to deliver the best service to all our users.
        </p>
        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          Join us today and find the perfect place for your dream home or growing business!
        </p>

        {/* Contact Us Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate("/contact")} // <-- Navigate to Contact page
            className="bg-gradient-to-r from-[#EC733B] to-[#e45716] hover:scale-105 duration-300 text-white py-2 px-6 rounded-full"
          >
            Contact Us
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;
