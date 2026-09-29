import React from "react"

const Card = ({ title, paragraph, listItems, buttonText }) => {
  return (
    <div className="relative flex flex-col gap-4 p-4 w-80 bg-black text-white rounded-lg shadow-xl overflow-hidden">
      {/* Card Border */}
      <div className="absolute inset-0 z-[-10] bg-gradient-to-r from-green-500 to-blue-500 opacity-25 rounded-lg"></div>

      {/* Card Title and Paragraph */}
      <div className="card_title__container">
        <span className="text-lg font-semibold">{title}</span>
        <p className="mt-1 text-sm text-gray-400">{paragraph}</p>
      </div>

      {/* Divider Line */}
      <hr className="border-t border-gray-700" />

      {/* List Items */}
      <ul className="flex flex-col gap-2">
        {listItems.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <span className="w-4 h-4 bg-teal-400 rounded-full flex justify-center items-center">
              <svg
                className="w-3 h-3 fill-black"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path
                  clipRule="evenodd"
                  d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                  fillRule="evenodd"
                ></path>
              </svg>
            </span>
            <span className="text-sm">{item}</span>
          </li>
        ))}
      </ul>

      {/* Button */}
      <button className="mt-4 py-2 px-4 w-full text-white bg-gradient-to-t from-teal-500 to-teal-600 rounded-full shadow-inner">
        {buttonText}
      </button>
    </div>
  );
};

export default Card