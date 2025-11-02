import React from "react";
import Image1 from "../../assets/categories/Flat.jpg";
import Image2 from "../../assets/categories/office.jpeg";
import Image3 from "../../assets/categories/Bachelor.jpeg";
import Image4 from "../../assets/categories/commercial.jpeg";
import Image5 from "../../assets/categories/sublet.jpeg";
import Image6 from "../../assets/categories/family.jpg";

const categories = [
  {
    id: 1,
    title: "Flat Apartment",
    ads: 2512,
    image: Image1,
  },
  {
    id: 2,
    title: "Office",
    ads: 281,
    image: Image2,
  },
  {
    id: 3,
    title: "Bachelor house",
    ads: 8,
    image: Image3,
  },
  {
    id: 4,
    title: "Commercial Space",
    ads: 177,
    image: Image4,
  },
  {
    id: 5,
    title: "Sublet with family",
    ads: 131,
    image: Image5,
  },
  {
    id: 6,
    title: "Family house",
    ads: 41,
    image: Image6,
  },
];

const Categories = () => {
  return (
    <div className="w-full bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Popular Categories
          </h2>
          <p className="text-gray-500 mt-2">
            There are 3228 ads in 12+ categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative rounded overflow-hidden shadow hover:shadow-lg transition h-64 group"
            >
              {/* Image */}
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition duration-300"
              />

              {/* Text Overlay at Bottom Left */}
              <div className="absolute bottom-0 left-0 m-4 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-md">
                <h3 className="text-white text-lg font-semibold">
                  {category.title}
                </h3>
                <p className="text-gray-300 text-sm">
                  {category.ads} Property ads
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Browse Button */}
        <div className="text-center mt-10">
          <button className="text-[#EC733B] px-6 py-2 border-2 border-[#EC733B] rounded-lg hover:bg-[#EC733B] hover:text-white transition duration-200 ease-in-out cursor-pointer">
            Browse All Property
          </button>
        </div>
      </div>
    </div>
  );
};

export default Categories;
