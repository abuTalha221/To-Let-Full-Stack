import React from "react";
import Image1 from "../../../assets/homep/Home2.png";
import Image2 from "../../../assets/homep/Home1.png";
import Image3 from "../../../assets/homep/Home3.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Categories from "../Categories";
import Navbar from "../../Components/Navbar";
import PublicProperties from "../PublicProperties/PublicProperties";

const ImageList = [
  {
    id: 1,
    img: Image1,
    title: "পরিবারসহ থাকার জন্য আদর্শ বাসা",
    description:
      "সুরক্ষিত পরিবেশে পরিবার নিয়ে থাকার জন্য বিভিন্ন ভাড়ার বাড়ি এখনই খুঁজুন।",
  },
  {
    id: 2,
    img: Image2,
    title: "ব্যাচেলরদের জন্য সহজ ও সাশ্রয়ী বাসা",
    description:
      "পড়াশোনা বা কাজের সুবিধার্থে ব্যাচেলরদের জন্য নানা ধরনের বাসা ভাড়া উপলব্ধ।",
  },
  {
    id: 3,
    img: Image3,
    title: "অফিস বা বিজনেসের জন্য স্পেস",
    description:
      "আপনার ব্যবসার সম্প্রসারণের জন্য নানা লোকেশনে রেডি টু মুভ অফিস স্পেস এখনই নিন।",
  },
];

const Home = () => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    arrows: false,
    pauseOnHover: false,
    pauseOnFocus: true,
  };

  return (
    <div>
      <Navbar />
      <div className="pt-[90px] w-full min-h-[80vh] bg-gray-100 flex items-center">
        <div className="container mx-auto p-6 sm:p-12">
          <Slider {...settings}>
            {ImageList.map((data) => (
              <div key={data.id}>
                <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-8">
                  <div className="flex flex-col justify-center gap-4 text-center sm:text-left order-2 sm:order-1">
                    <h1
                      data-aos="zoom-in"
                      className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800"
                    >
                      {data.title}
                    </h1>

                    <p data-aos="fade-up" className="text-base text-gray-600">
                      {data.description}
                    </p>
                    <div data-aos="fade-up">
                      <button
                       onClick={() => window.scrollTo({ top: 900, behavior: "smooth" })}
                       className="bg-gradient-to-r from-[#EC733B] to-[#e45716] hover:scale-105 duration-300 text-white py-2 px-6 rounded-full cursor-pointer">
                        Search Now
                      </button>
                    </div>
                  </div>

                  <div
                    data-aos="zoom-in"
                    data-aos-once="true"
                    className="order-1 sm:order-2 flex justify-center"
                  >
                    <div className="relative">
                      <img
                        src={data.img}
                        alt={data.title}
                        className="w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      <div
        data-aos="fade-up"
        className="container mx-auto px-6 py-12 text-center"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
          আপনার প্রয়োজনের বাসা খুঁজে নিন সহজেই
        </h2>

        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
          আমরা আপনাকে দিচ্ছি সবচেয়ে সহজ উপায়ে আপনার বাজেট, লোকেশন এবং প্রয়োজন
          অনুযায়ী বাসা, অফিস অথবা সাবলেট খুঁজে নেওয়ার সুবিধা। হাজারো ভেরিফাইড
          অ্যাড এর মধ্য থেকে ঝামেলাহীনভাবে খুঁজে নিন আপনার পছন্দের ঠিকানা।
        </p>

        <button
          onClick={() => window.scrollTo({ top: 900, behavior: "smooth" })}
          className="mt-6 bg-[#EC733B] hover:bg-[#e45716] text-white px-8 py-3 rounded-full shadow-md hover:shadow-lg transition cursor-pointer"
        >
          Start Searching
        </button>
      </div>

      <PublicProperties />
      <Categories />
    </div>
  );
};

export default Home;
