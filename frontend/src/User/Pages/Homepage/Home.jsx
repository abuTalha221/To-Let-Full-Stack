import React from "react";
import Image1 from "../../../assets/homep/Home2.png";
import Image2 from "../../../assets/homep/Home1.png";
import Image3 from "../../../assets/homep/Home3.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SearchProperty from "../SearchProperty/SearchProperty";
import Properties from "../Properties";
import Categories from "../Categories";
import Navbar from "../../Components/Navbar";

const ImageList = [
  {
    id: 1,
    img: Image1, // You can assign different images later
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
                  {/* Text Section */}
                  <div className="flex flex-col justify-center gap-4 text-center sm:text-left order-2 sm:order-1">
                    <h1
                      data-aos="zoom-in"
                      data-aos-duration="500"
                      data-aos-once="true"
                      className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800"
                    >
                      {data.title}
                    </h1>
                    <p
                      data-aos="fade-up"
                      data-aos-duration="500"
                      data-aos-delay="100"
                      className="text-base text-gray-600"
                    >
                      {data.description}
                    </p>
                    <div
                      data-aos="fade-up"
                      data-aos-duration="500"
                      data-aos-delay="300"
                    >
                      <button className="bg-gradient-to-r from-[#EC733B] to-[#e45716] hover:scale-105 duration-300 text-white py-2 px-6 rounded-full cursor-pointer">
                        Book Now
                      </button>
                    </div>
                  </div>

                  {/* Image Section */}
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
      <section id="search-property">
        <SearchProperty />
      </section>
      <Properties />
      <Categories />
    </div>
  );
};

export default Home;
