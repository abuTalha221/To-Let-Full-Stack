import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt className="text-3xl text-orange-500" />,
      title: "Address",
      details: "Bamnertek Main Road, Uttara, Dhaka"
    },

    {
      icon: <FaPhone className="text-3xl text-orange-500" />,
      title: "Phone",
      details: "+8801791740135"
    },
    {
      icon: <FaEnvelope className="text-3xl text-orange-500" />,
      title: "Email",
      details: "team.tolet@gmail.com"
    },
    {
      icon: <FaGlobe className="text-3xl text-orange-500" />,
      title: "Website",
      details: "www.tolet.com"
    },
  ];

  const socialLinks = [
    { icon: <FaFacebook />, label: "Facebook" },
    { icon: <FaTwitter />, label: "Twitter" },
    { icon: <FaLinkedin />, label: "LinkedIn" },
    { icon: <FaInstagram />, label: "Instagram" },
  ];
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 mt-18">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto mb-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-4">Get In Touch With Us</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Have questions or feedback? We'd love to hear from you. Our team is here to help!
          </p>
        </div>
      </div>

      {/* Contact Information Cards */}
      <div className="max-w-6xl mx-auto mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="flex justify-center mb-4">{info.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">{info.title}</h3>
              <p className="text-gray-600 text-center text-sm">{info.details}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form and Additional Info */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feedback Form */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Send Us a Message</h2>
            <p className="text-gray-600 mb-8">Fill out the form below and we'll get back to you as soon as possible.</p>
            
            {submitted && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                ✓ Thank you! Your message has been received.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    placeholder="+880 1234567890"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    placeholder="How can we help?"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
                  placeholder="Your message here..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#EC733B] to-[#e45716] hover:scale-105 duration-300 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Additional Information */}
          <div className="lg:col-span-1">
            {/* Follow Us */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Follow Us</h3>
              <div className="flex gap-4">
                {socialLinks.map((link, index) => (
                  <button
                    key={index}
                    className="w-12 h-12 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition text-xl"
                    title={link.label}
                  >
                    {link.icon}
                  </button>
                ))}
              </div>
              <p className="text-gray-600 text-sm mt-4">
                Connect with us on social media for updates and property listings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
