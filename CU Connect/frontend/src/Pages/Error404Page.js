import React from "react";
import { Link } from "react-router-dom";

function Error404Page() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="mt-4 text-lg text-gray-700">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link to="/">
        <button className="mt-6 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">
          Go Back to Home
        </button>
      </Link>
    </div>
  );
}

export default Error404Page;
