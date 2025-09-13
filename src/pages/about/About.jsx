import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-6">О нашем сайте 🎬</h1>
      <p className="text-lg max-w-2xl text-center mb-4">
        <span className="text-emerald-400 font-semibold">HULK</span><span>HUB</span> — это современный кино-портал, где пользователи могут регистрироваться, добавлять свои фильмы и делиться ими с друзьями. 
      </p>
      <p className="text-lg max-w-2xl text-center mb-6">
        Вы можете искать фильмы, добавлять описание и миниатюру, а также устанавливать свой аватар для личного профиля.
      </p>

      <Link to="/" className="text-emerald-300 hover:underline text-lg">
        ← На главную
      </Link>
    </div>
  );
}
