import React from "react";

export default function VideoCard({ movie }) {
  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
      <img
        src={movie.thumbnail}
        alt={movie.title}
        className="w-full h-72 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-bold mb-2">{movie.title}</h2>
        <p className="text-sm text-gray-400">{movie.description}</p>
      </div>
    </div>
  );
}
