import React from "react";

export function Hero() {
  return (
    <section className="bg-blue-50 py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
          Connect With Innovative Companies in SC
        </h1>
        <form className="flex justify-center">
          <input
            type="text"
            placeholder="Search companies, categories, or counties..."
            className="w-full max-w-md px-4 py-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-r-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>
      </div>
    </section>
  );
}