import React from 'react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 mt-10">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-8" data-aos="fade-down">
        Contact Us
      </h2>


      {/* Contact Information */}
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-6xl mb-12 grid grid-cols-1 md:grid-cols-2 gap-10" data-aos="fade-up">
        <div className="flex flex-col gap-6">
          <h3 className="text-2xl font-bold text-gray-700">Get in Touch</h3>
          <p className="text-gray-600">
            Have a question, feedback, or need support? Fill out the form or reach us directly through the following contact details:
          </p>
          <div className="text-gray-700 space-y-2">
            <p>📍 Address: 123 Main Street, Dhaka, Bangladesh</p>
            <p>📞 Phone: +880 1234-567890</p>
            <p>✉️ Email: support@example.com</p>
            <p>🌐 Website: www.example.com</p>
          </div>
        </div>

        {/* Feedback Form */}
        <div>
            <h1 className=' flex justify-center items-center text-3xl font-bold '>User Feedback</h1>
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#e45716] focus:border-[#e45716]"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#e45716] focus:border-[#e45716]"
              />
            </div>

        

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#e45716] focus:border-[#e45716]"
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#EC733B] to-[#e45716] hover:scale-105 duration-300 text-white py-2 px-6 rounded-full"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
