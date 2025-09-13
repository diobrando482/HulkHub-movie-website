import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "../auth/AuthModal";

const initUsers = () => {
  const users = JSON.parse(localStorage.getItem("users"));
  if (!users) {
    const defaultUsers = [
      { id: 1, name: "Адилет", email: "adilet@test.com", password: "1234", movies: [], avatar: "" },
      { id: 2, name: "Алмаз", email: "almaz@test.com", password: "5678", movies: [], avatar: "" },
    ];
    localStorage.setItem("users", JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return users;
};

export default function Header({ setCurrentUser }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [users, setUsers] = useState(initUsers());
  const [currentUserLocal, setCurrentUserLocal] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (loggedUser) {
      setCurrentUserLocal(loggedUser);
      setAvatarUrl(loggedUser.avatar || "");
    }
  }, []);

  const handleRegister = (e) => {
    e.preventDefault();
    const name = e.target[0].value.trim();
    const email = e.target[1].value.trim();
    const password = e.target[2].value.trim();

    if (!name || !email || !password) return alert("Заполните все поля!");
    if (users.find((u) => u.email === email)) return alert("Пользователь с таким email уже существует!");

    const newUser = { id: Date.now(), name, email, password, movies: [], avatar: "" };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    setCurrentUserLocal(newUser);
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    setCurrentUser(newUser);
    setIsRegisterOpen(false);
    setAvatarUrl("");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target[0].value.trim();
    const password = e.target[1].value.trim();

    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) return alert("Неверный email или пароль!");

    setCurrentUserLocal(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
    setCurrentUser(user);
    setIsLoginOpen(false);
    setAvatarUrl(user.avatar || "");
  };

  const handleLogout = () => {
    setCurrentUserLocal(null);
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  };

  const handleAvatarChange = () => {
    if (!avatarUrl) return alert("Введите URL аватарки!");
    const updatedUser = { ...currentUserLocal, avatar: avatarUrl };
    setCurrentUserLocal(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    const updatedUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    alert("Аватар обновлен!");
  };

  return (
    <header className="bg-gradient-to-r from-purple-700 via-indigo-800 to-blue-900 text-white p-4 flex flex-col md:flex-row justify-between items-center shadow-md relative z-10">
      <h1 className="text-2xl font-bold">
        <span className="text-emerald-600 font-extrabold">HULK</span>
        <span>HUB</span>
      </h1>

      {/* Навигация */}
      <nav className="flex items-center space-x-4 mt-3 md:mt-0">
        <Link to="/" className="text-emerald-300 hover:underline transition duration-200">Главная</Link>
        <Link to="/about" className="text-emerald-300 hover:underline transition duration-200">О сайте</Link>
        {currentUserLocal && (
          <Link to="/profile" className="text-emerald-300 hover:underline transition duration-200">Профиль</Link>
        )}
      </nav>

      {/* Пользовательские кнопки */}
      <div className="flex items-center space-x-4 mt-3 md:mt-0">
        {currentUserLocal ? (
          <div className="flex items-center space-x-2 relative">
            {currentUserLocal.avatar ? (
              <img
                src={currentUserLocal.avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover border border-gray-700 transition transform hover:scale-110"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white">
                👤
              </div>
            )}
            <span>{currentUserLocal.name}</span>

            {/* Ввод аватарки */}
            <div className="absolute top-12 left-0 bg-gray-800 p-2 rounded shadow-md flex flex-col space-y-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
              <input
                type="text"
                placeholder="URL аватарки"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="p-1 rounded bg-gray-700 text-white border border-gray-600"
              />
              <button
                onClick={handleAvatarChange}
                className="px-2 py-1 bg-green-600 rounded hover:bg-green-500"
              >
                Обновить аватар
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="ml-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-500 transition duration-200"
            >
              Выйти
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => setIsLoginOpen(true)}
              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition duration-200"
            >
              Войти
            </button>
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500 transition duration-200"
            >
              Регистрация
            </button>
          </>
        )}
      </div>

      {/* Модалки */}
      <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} title="Вход">
        <form className="flex flex-col space-y-3" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="p-2 rounded bg-gray-800 text-white border border-gray-700"
          />
          <input
            type="password"
            placeholder="Пароль"
            className="p-2 rounded bg-gray-800 text-white border border-gray-700"
          />
          <button type="submit" className="bg-blue-600 py-2 rounded-lg hover:bg-blue-500">
            Войти
          </button>
        </form>
      </Modal>

      <Modal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} title="Регистрация">
        <form className="flex flex-col space-y-3" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Имя"
            className="p-2 rounded bg-gray-800 text-white border border-gray-700"
          />
          <input
            type="email"
            placeholder="Email"
            className="p-2 rounded bg-gray-800 text-white border border-gray-700"
          />
          <input
            type="password"
            placeholder="Пароль"
            className="p-2 rounded bg-gray-800 text-white border border-gray-700"
          />
          <button type="submit" className="bg-green-600 py-2 rounded-lg hover:bg-green-500">
            Зарегистрироваться
          </button>
        </form>
      </Modal>
    </header>
  );
}
