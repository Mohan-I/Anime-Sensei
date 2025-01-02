import React from "react";
import PageHero from "./ui/PageHero";
import { TiArrowForward, TiInputCheckedOutline } from "react-icons/ti";

const PricingPlan = () => {
  return (
    <div>
      <section className="py-10 bg-white sm:py-16 lg:py-24">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center">
            <div className="font-general text-sm uppercase md:text-[10px] text-gray-600">
              Suscribe to Anime Sensei
            </div>
            <PageHero
              title="prici<b>ng</b> <b>an</b>d pl<b>an</b>s"
              subtitle="Suscribe to Anime Sensei"
              containerClass="my-14 pointer-events-none mix-blend-difference relative z-10"
            />
            <p className="mt-4 font-general text-lg leading-relaxed text-gray-600">
              Choose a prepaid most loved plans that suits your unique
              aspiration.
            </p>
          </div>
          {/* lg+ */}
          <div className="hidden mt-16 lg:block">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="py-8 pr-4" />
                  <th className="px-4 py-8 text-center">
                    <span className="text-base font-medium text-blue-600">
                      {" "}
                      Free{" "}
                    </span>
                    <p className="mt-6 text-6xl font-bold">$0</p>
                    <p className="mt-2 text-base font-normal text-gray-500">
                      Per month
                    </p>
                  </th>
                  <th className="px-4 py-8 text-center">
                    <span className="text-base font-medium text-blue-600">
                      {" "}
                      Basic{" "}
                    </span>
                    <p className="mt-6 text-6xl font-bold">$9</p>
                    <p className="mt-2 text-base font-normal text-gray-500">
                      Per month
                    </p>
                  </th>
                  <th className="px-4 py-8 text-center bg-gray-900 rounded-t-xl">
                    <span className="px-4 py-2 text-base font-medium text-white bg-blue-600 rounded-full">
                      {" "}
                      Silver{" "}
                    </span>
                    <p className="mt-6 text-6xl font-bold text-white">$15</p>
                    <p className="mt-2 text-base font-normal text-gray-200">
                      Per month
                    </p>
                  </th>
                  <th className="px-4 py-8 text-center">
                    <span className="text-base font-medium text-blue-600">
                      {" "}
                      Platinum{" "}
                    </span>
                    <p className="mt-6 text-6xl font-bold">$49</p>
                    <p className="mt-2 text-base font-normal text-gray-500">
                      Per month
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-4 pr-4 font-medium border-b border-gray-200">
                    Epsiodes
                  </td>
                  <td className="px-4 py-4 text-center border-b border-gray-200">
                    05
                  </td>
                  <td className="px-4 py-4 text-center border-b border-gray-200">
                    20
                  </td>
                  <td className="px-4 py-4 text-center text-white bg-gray-900 border-b border-white/20">
                    50
                  </td>
                  <td className="px-4 py-4 text-center border-b border-gray-200">
                    Unlimited
                  </td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 font-medium border-b border-gray-200">
                    Download storage
                  </td>
                  <td className="px-4 py-4 text-center border-b border-gray-200">
                    100 GB
                  </td>
                  <td className="px-4 py-4 text-center border-b border-gray-200">
                    500 GB
                  </td>
                  <td className="px-4 py-4 text-center text-white bg-gray-900 border-b border-white/20">
                    1 TB
                  </td>
                  <td className="px-4 py-4 text-center border-b border-gray-200">
                    Unlimited
                  </td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 font-medium border-b border-gray-200">
                    Downloads
                  </td>
                  <td className="px-4 py-4 text-center border-b border-gray-200">
                    -
                  </td>
                  <td className="px-4 py-4 text-center border-b border-gray-200">
                    15
                  </td>
                  <td className="px-4 py-4 text-center text-white bg-gray-900 border-b border-white/20">
                    Unlimited
                  </td>
                  <td className="px-4 py-4 text-center border-b border-gray-200">
                    Unlimited
                  </td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 font-medium border-b border-gray-200">
                    Devices
                  </td>
                  <td className="px-4 py-4 text-center border-b border-gray-200">
                    2
                  </td>
                  <td className="px-4 py-4 text-center border-b border-gray-200">
                    6
                  </td>
                  <td className="px-4 py-4 text-center text-white bg-gray-900 border-b border-white/20">
                    12
                  </td>
                  <td className="px-4 py-4 text-center border-b border-gray-200">
                    Unlimited
                  </td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 font-medium border-b border-gray-200">
                    Quality
                  </td>
                  <td className="px-4 py-4 text-center border-b border-gray-200">
                    2048p
                  </td>
                  <td className="px-4 py-4 text-center border-b border-gray-200">
                    4K (Ultra HD) + HDR
                  </td>
                  <td className="px-4 py-4 text-center text-white bg-gray-900 border-b border-white/20">
                    8D spatial audio
                  </td>
                  <td className="px-4 py-4 text-center border-b border-gray-200">
                    Home Theatre
                  </td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 font-medium border-b border-gray-200">
                    Ad Free
                  </td>
                  <td className="px-4 py-4 text-center border-b border-gray-200">
                    -
                  </td>
                  <td className="px-4 py-4 text-center border-b border-gray-200">
                    -
                  </td>
                  <td className="px-4 py-4 text-center text-white bg-gray-900 border-b border-white/20">
                    <TiInputCheckedOutline className="w-8 h-8 mx-auto font-2xl" />
                  </td>
                  <td className="px-4 py-4 text-center border-b border-gray-200">
                    <TiInputCheckedOutline className="w-8 h-8 mx-auto font-2xl" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 font-medium border-b border-gray-200">
                    Projector Stable
                  </td>
                  <td className="px-4 py-4 text-center border-b border-gray-200">
                    -
                  </td>
                  <td className="px-4 py-4 text-center border-b border-gray-200">
                    -
                  </td>
                  <td className="px-4 py-4 text-center text-white bg-gray-900 border-b border-white/20">
                    <TiInputCheckedOutline className="w-8 h-8 mx-auto font-2xl" />
                  </td>
                  <td className="px-4 py-4 text-center border-b border-gray-200">
                    <TiInputCheckedOutline className="w-8 h-8 mx-auto font-2xl" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 font-medium border-b border-gray-200">
                    Device Install
                  </td>
                  <td className="px-4 py-4 text-center border-b border-gray-200">
                    -
                  </td>
                  <td className="px-4 py-4 text-center border-b border-gray-200">
                    -
                  </td>
                  <td className="px-4 py-4 text-center text-white bg-gray-900 border-b border-white/20">
                    <TiInputCheckedOutline className="w-8 h-8 mx-auto font-2xl" />
                  </td>
                  <td className="px-4 py-4 text-center border-b border-gray-200">
                    <TiInputCheckedOutline className="w-8 h-8 mx-auto font-2xl" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 font-medium border-b border-gray-200">
                    5G Server speed
                  </td>
                  <td className="px-4 py-4 text-center border-b border-gray-200">
                    -
                  </td>
                  <td className="px-4 py-4 text-center border-b border-gray-200">
                    -
                  </td>
                  <td className="px-4 py-4 text-center text-white bg-gray-900 border-b border-white/20">
                    <TiInputCheckedOutline className="w-8 h-8 mx-auto font-2xl" />
                  </td>
                  <td className="px-4 py-4 text-center border-b border-gray-200">
                    <TiInputCheckedOutline className="w-8 h-8 mx-auto font-2xl" />
                  </td>
                </tr>
                <tr>
                  <td className="py-6 pr-4" />
                  <td className="px-4 py-6 text-center">
                    <a
                      href="#"
                      title=""
                      className="inline-flex items-center font-robert-medium text-blue-600 hover:text-emerald-400"
                    >
                      Get Started
                      <TiArrowForward />
                    </a>
                  </td>
                  <td className="px-4 py-6 text-center">
                  <a
                      href="#"
                      title=""
                      className="inline-flex items-center font-robert-medium text-blue-600 hover:text-emerald-400"
                    >
                      Get Started
                      <TiArrowForward />
                    </a>
                  </td>
                  <td className="px-4 py-6 text-center bg-gradient-to-r from-rose-400 to-violet-600 rounded-b-xl">
                  <a
                      href="#"
                      title=""
                      className="inline-flex items-center font-robert-medium text-white hover:text-emerald-400"
                    >
                      Get Started
                      <TiArrowForward />
                    </a>
                  </td>
                  <td className="px-4 py-6 text-center">
                  <a
                      href="#"
                      title=""
                      className="inline-flex items-center font-robert-medium text-blue-600 hover:text-emerald-400"
                    >
                      Get Started
                      <TiArrowForward />
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* xs to lg */}
        <div className="block mt-12 border-t border-b border-gray-200 divide-y divide-gray-200 lg:hidden">
          <div className="grid grid-cols-4 text-center divide-x divide-gray-200">
            <div className="px-2 py-2">
              <span className="text-sm font-medium text-blue-600"> Free </span>
              <p className="mt-2 text-xl font-bold">$0</p>
              <span className="mt-1 text-sm font-normal text-gray-500">
                {" "}
                Per month{" "}
              </span>
            </div>
            <div className="px-2 py-2">
              <span className="text-sm font-medium text-blue-600"> Team </span>
              <p className="mt-2 text-xl font-bold">$99</p>
              <span className="mt-1 text-sm font-normal text-gray-500">
                {" "}
                Per month{" "}
              </span>
            </div>
            <div className="px-2 py-2">
              <span className="text-sm font-medium text-blue-600">
                {" "}
                Popular{" "}
              </span>
              <p className="mt-2 text-xl font-bold">$150</p>
              <span className="mt-1 text-sm font-normal text-gray-500">
                {" "}
                Per month{" "}
              </span>
            </div>
            <div className="px-2 py-2">
              <span className="text-sm font-medium text-blue-600">
                {" "}
                Enterprise{" "}
              </span>
              <p className="mt-2 text-xl font-bold">$490</p>
              <span className="mt-1 text-sm font-normal text-gray-500">
                {" "}
                Per month{" "}
              </span>
            </div>
          </div>
          <div className="px-2 py-4 sm:px-4">
            <p className="font-robert-medium">Website number</p>
          </div>
          <div className="grid grid-cols-4 text-center divide-x divide-gray-200">
            <div className="px-2 py-2">01</div>
            <div className="px-2 py-2">10</div>
            <div className="px-2 py-2">100</div>
            <div className="px-2 py-2">Unlimited</div>
          </div>
          <div className="px-2 py-4 sm:px-4">
            <p className="font-robert-medium">Server storage</p>
          </div>
          <div className="grid grid-cols-4 text-center divide-x divide-gray-200">
            <div className="px-2 py-2">100 GB</div>
            <div className="px-2 py-2">500 GB</div>
            <div className="px-2 py-2">1 TB</div>
            <div className="px-2 py-2">Unlimited</div>
          </div>
          <div className="px-2 py-4 sm:px-4">
            <p className="font-robert-medium">Database</p>
          </div>
          <div className="grid grid-cols-4 text-center divide-x divide-gray-200">
            <div className="px-2 py-2">-</div>
            <div className="px-2 py-2">15</div>
            <div className="px-2 py-2">Unlimited</div>
            <div className="px-2 py-2">Unlimited</div>
          </div>
          <div className="px-2 py-4 sm:px-4">
            <p className="font-robert-medium">Unmetered bandwidth</p>
          </div>
          <div className="grid grid-cols-4 text-center divide-x divide-gray-200">
            <div className="px-2 py-2">-</div>
            <div className="px-2 py-2">
              <svg
                className="w-5 h-5 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="px-2 py-2">
              <svg
                className="w-5 h-5 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="px-2 py-2">
              <svg
                className="w-5 h-5 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className="px-2 py-4 sm:px-4">
            <p className="font-robert-medium">SSD Disk</p>
          </div>
          <div className="grid grid-cols-4 text-center divide-x divide-gray-200">
            <div className="px-2 py-2">-</div>
            <div className="px-2 py-2">
              <svg
                className="w-5 h-5 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="px-2 py-2">
              <svg
                className="w-5 h-5 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="px-2 py-2">
              <svg
                className="w-5 h-5 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className="px-2 py-4 sm:px-4">
            <p className="font-robert-medium">VCPUS Fontworld</p>
          </div>
          <div className="grid grid-cols-4 text-center divide-x divide-gray-200">
            <div className="px-2 py-2">-</div>
            <div className="px-2 py-2">
              <svg
                className="w-5 h-5 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="px-2 py-2">
              <svg
                className="w-5 h-5 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="px-2 py-2">
              <svg
                className="w-5 h-5 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className="px-2 py-4 sm:px-4">
            <p className="font-robert-medium">WordPress install</p>
          </div>
          <div className="grid grid-cols-4 text-center divide-x divide-gray-200">
            <div className="px-2 py-2">-</div>
            <div className="px-2 py-2">
              <svg
                className="w-5 h-5 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="px-2 py-2">
              <svg
                className="w-5 h-5 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="px-2 py-2">
              <svg
                className="w-5 h-5 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className="grid grid-cols-4 text-center divide-x divide-gray-200">
            <div className="px-1 py-2 sm:px-4">
              <span className="text-sm font-medium text-blue-600"> Free </span>
              <p className="mt-2 text-xl font-bold">$0</p>
              <span className="mt-1 text-sm font-normal text-gray-500">
                {" "}
                Per month{" "}
              </span>
              <a
                href="#"
                title=""
                className="flex items-center justify-center w-full px-1 py-2 mt-5 text-sm text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                role="button"
              >
                {" "}
                Get Started{" "}
              </a>
            </div>
            <div className="px-1 py-2 sm:px-4">
              <span className="text-sm font-medium text-blue-600"> Team </span>
              <p className="mt-2 text-xl font-bold">$99</p>
              <span className="mt-1 text-sm font-normal text-gray-500">
                {" "}
                Per month{" "}
              </span>
              <a
                href="#"
                title=""
                className="flex items-center justify-center w-full px-1 py-2 mt-5 text-sm text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                role="button"
              >
                {" "}
                Get Started{" "}
              </a>
            </div>
            <div className="px-1 py-2 sm:px-4">
              <span className="text-sm font-medium text-blue-600">
                {" "}
                Popular{" "}
              </span>
              <p className="mt-2 text-xl font-bold">$150</p>
              <span className="mt-1 text-sm font-normal text-gray-500">
                {" "}
                Per month{" "}
              </span>
              <a
                href="#"
                title=""
                className="flex items-center justify-center w-full px-1 py-2 mt-5 text-sm text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                role="button"
              >
                {" "}
                Get Started{" "}
              </a>
            </div>
            <div className="px-1 pt-2 pb-4 sm:px-4">
              <span className="text-sm font-medium text-blue-600">
                {" "}
                Enterprise{" "}
              </span>
              <p className="mt-2 text-xl font-bold">$490</p>
              <span className="mt-1 text-sm font-normal text-gray-500">
                {" "}
                Per month{" "}
              </span>
              <a
                href="#"
                title=""
                className="flex items-center justify-center w-full px-1 py-2 mt-5 text-sm text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                role="button"
              >
                {" "}
                Get Started{" "}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPlan;
