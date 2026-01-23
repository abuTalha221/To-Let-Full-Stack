import React from "react";

const OrderHomeIntro = () => {
  return (
    <div className="mt-40 mb-20 flex justify-center px-4 ">
      <div className="w-full max-w-2xl p-3">
        <div className="bg-white shadow-lg rounded-xl p-6 md:p-8">
          <p className="text-gray-700 text-base md:text-lg leading-7 mb-4">
            আপনার পছন্দমত বাসা খুঁজে পেতে আমাদের সেবা নিন। আমাদের অভিজ্ঞ টিম 
            <b>৭ কর্মদিনের মধ্যেই</b> আপনার সবচেয়ে ভালো অপশন নিয়ে আসবে।
          </p>

          <p className="text-lg md:text-xl font-semibold text-gray-800 mb-3">
             কীভাবে কাজ করে?
          </p>

          <ul className="space-y-2 text-gray-700 text-base md:text-md leading-7 list-none">
            <li>1️⃣ প্রথমে আমাদের ফর্মটা সঠিকভাবে পূরণ করে জমা দিন</li>
            <li>2️⃣ আপনার পছন্দের প্যাকেজ বেছে নিয়ে পেমেন্ট করুন</li>
            <li>3️⃣ আমরা আপনার সাথে কল করব আর আপনার চাহিদা বুঝে নেব</li>
            <li>4️⃣ নির্ধারিত সময়ের মধ্যে ভালো অপশন পাঠিয়ে দেব</li>
          </ul>

          <p className="mt-4 text-gray-800 font-semibold">
            যদি আমরা নির্ধারিত সময়ে বাসা খুঁজে না দিতে পারি, তাহলে আপনার টাকা সম্পূর্ণভাবে ফেরত পাবেন।
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
