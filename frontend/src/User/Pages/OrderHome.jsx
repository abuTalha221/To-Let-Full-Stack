import React from "react";

const OrderHomeIntro = () => {
  return (
    <div className="mt-40 mb-20 flex justify-center px-4 ">
      <div className="w-full max-w-2xl p-3">
        <div className="bg-white shadow-lg rounded-xl p-6 md:p-8">
          <p className="text-gray-700 text-base md:text-lg leading-7 mb-4">
            আপনার চাহিদা অনুযায়ী বাসা খুঁজে দিতে আমাদের সার্ভিস অর্ডার করুন।
            অভিজ্ঞ প্রতিনিধি দল <b>৭ কার্যদিবসের মধ্যে</b> আপনার জন্য সঠিক বাসা
            খুঁজে দেবে।
          </p>

          <p className="text-lg md:text-xl font-semibold text-gray-800 mb-3">
            👉 কীভাবে কাজ করে?
          </p>

          <ul className="space-y-2 text-gray-700 text-base md:text-md leading-7 list-none">
            <li>1️⃣ অর্ডার ফর্মটি সম্পূর্ণ ও সঠিকভাবে পূরণ করুন</li>
            <li>2️⃣ পছন্দমতো প্যাকেজ সিলেক্ট করে পেমেন্ট সম্পন্ন করুন</li>
            <li>3️⃣ আমাদের প্রতিনিধি আপনার সঙ্গে যোগাযোগ করে বিস্তারিত চাহিদা
              জানবেন
            </li>
            <li>4️⃣ নির্ধারিত সময়ের মধ্যে আপনার জন্য বাসা খুঁজে দেওয়া হবে</li>
          </ul>

          <p className="mt-4 text-gray-800 font-semibold">
            যদি আমরা নির্ধারিত সময়ের মধ্যে আপনার জন্য বাসা খুঁজে দিতে ব্যর্থ হই,
            তাহলে রিফান্ড নীতিমালা অনুযায়ী টাকা ফেরত দেওয়া হবে।
          </p>

          <div className="text-center mt-6">
            <a
              href="/order-property"
              className="mt-6 px-6 py-3 bg-[#EC733B] text-white font-semibold rounded-lg hover:bg-[#d35f25] transition cursor-pointer"
            >
              Order Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHomeIntro;
