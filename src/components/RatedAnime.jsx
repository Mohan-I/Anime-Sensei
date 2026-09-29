import React, { useState } from "react";
import { data } from "../data/data";

const RatedAnime = () => {
    const [rates, setRates] = useState(data);

    // Filter by category (e.g., Action, Romantic, etc.)
    const filterType = (category) => {
        setRates(
            data.filter((item) => item.category === category)
        );
    };

    // Filter by price category
    const filterPrice = (priceCategory) => {
        let minPrice = 0;
        let maxPrice = 0;

        switch (priceCategory) {
            case "$":
                minPrice = 5;
                maxPrice = 15;
                break;
            case "$$":
                minPrice = 15;
                maxPrice = 30;
                break;
            case "$$$":
                minPrice = 30;
                maxPrice = 40;
                break;
            case "$$$$":
                minPrice = 40;
                maxPrice = 50;
                break;
            default:
                setRates(data); // Reset to all data if no price filter is selected
                return;
        }

        // Filter items based on price range
        setRates(
            data.filter(
                (item) => item.price >= minPrice && item.price <= maxPrice
            )
        );
    };

    return (
        <div className="max-w-[1640px] m-auto px-6 py-12">
            <h1 className="text-green-600 special-font hero-heading text-4xl text-center mb-8">Top R<b>a</b>t<b>e</b>d <b>A</b>ni<b>me</b></h1>

            <div className="text-center mb-10">
                <span className="inline-block w-1 h-1 rounded-full bg-indigo-500 ml-1"></span>
                <span className="inline-block w-3 h-1 rounded-full bg-indigo-500 ml-1"></span>
                <span className="inline-block w-40 h-1 rounded-full bg-indigo-500"></span>
                <span className="inline-block w-3 h-1 rounded-full bg-indigo-500 ml-1"></span>
                <span className="inline-block w-1 h-1 rounded-full bg-indigo-500 ml-1"></span>
            </div>

            {/* Filter Row */}
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0 mb-6">
                {/* Filter Type */}
                <div className="flex flex-wrap space-x-4 font-general text-xs uppercase">
                    <p className="font-bold text-gray-700">Filter by <br /> Type</p>
                    <button
                        onClick={() => setRates(data)}
                        className="px-4 py-2 rounded-full border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                    >
                        All
                    </button>
                    <button
                        onClick={() => filterType('action')}
                        className="px-4 py-2 rounded-full border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                    >
                        Action
                    </button>
                    <button
                        onClick={() => filterType('romantic')}
                        className="px-4 py-2 rounded-full border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                    >
                        Romantic
                    </button>
                    <button
                        onClick={() => filterType('horror')}
                        className="px-4 py-2 rounded-full border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                    >
                        Horror
                    </button>
                    <button
                        onClick={() => filterType('thriller')}
                        className="px-4 py-2 rounded-full border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                    >
                        Thriller
                    </button>
                </div>

                {/* Filter Price */}
                <div className="flex flex-wrap space-x-4 font-general text-xs uppercase">
                    <p className="font-bold text-gray-700">Filter by <br /> Price</p>
                    <button
                        onClick={() => filterPrice('$')}
                        className="px-4 py-2 rounded-full border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                    >
                        $ 5 - 15
                    </button>
                    <button
                        onClick={() => filterPrice('$$')}
                        className="px-4 py-2 rounded-full border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                    >
                        $ 15 - 30
                    </button>
                    <button
                        onClick={() => filterPrice('$$$')}
                        className="px-2 py-1 rounded-full border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                    >
                        $ 30 - 40
                    </button>
                    <button
                        onClick={() => filterPrice('$$$$')}
                        className="px-2 py-1 rounded-full border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                    >
                        $ 40 - 50
                    </button>
                </div>
            </div>

            {/* Display Anime */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {rates.map((item, index) => (
                    <div
                        key={index}
                        className="border bg-white rounded-lg shadow-lg hover:scale-105 duration-300 transition-transform"
                    >
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-[200px] object-cover rounded-t-lg"
                        />
                        <div className="px-4 py-4">
                            <h3 className="font-robert-regular font-semibold text-lg text-gray-900">{item.name}</h3>
                            <div className="mt-2 flex justify-between items-center">
                                <p className="text-green-600 font-bold font-general text-xs uppercase">${item.price}</p>
                                <span className="bg-green-500 text-white font-general text-xs uppercase p-2 rounded-md text-sm">{item.category}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RatedAnime;
