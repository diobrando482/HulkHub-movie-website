import React, { useState, useEffect } from "react";

export default function Profile() {
  const [currentUser, setCurrentUser] = useState(null);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [users, setUsers] = useState([]);
  const [allMovies, setAllMovies] = useState([]);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("currentUser"));
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const movies = JSON.parse(localStorage.getItem("allMovies")) || [];
    
    if (loggedUser) {
      // Убедимся, что у пользователя есть поле movies
      const userWithMovies = {
        ...loggedUser,
        movies: loggedUser.movies || []
      };
      
      setCurrentUser(userWithMovies);
      setName(userWithMovies.name);
      setAvatar(userWithMovies.avatar || "");
      setUsers(allUsers);
      setAllMovies(movies);
      
      // Обновляем пользователя в localStorage, если у него не было movies
      if (!loggedUser.movies) {
        localStorage.setItem("currentUser", JSON.stringify(userWithMovies));
        
        // Также обновляем в общем списке пользователей
        const updatedUsers = allUsers.map(u => 
          u.id === userWithMovies.id ? userWithMovies : u
        );
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        setUsers(updatedUsers);
      }
    }
  }, []);

  // Обновление профиля
  const handleProfileSave = () => {
    if (!name) return alert("Имя не может быть пустым!");
    const updatedUser = { ...currentUser, name, avatar };
    setCurrentUser(updatedUser);

    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    setUsers(updatedUsers);
    alert("Профиль обновлён!");
  };

  // Редактирование фильма
  const handleMovieChange = (id, field, value) => {
    const updatedMovies = currentUser.movies.map(movie =>
      movie.id === id ? { ...movie, [field]: value } : movie
    );
    const updatedUser = { ...currentUser, movies: updatedMovies };
    setCurrentUser(updatedUser);

    // Обновляем пользователей
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Обновляем allMovies
    const updatedAllMovies = allMovies.map(movie =>
      movie.id === id ? { ...movie, [field]: value } : movie
    );
    setAllMovies(updatedAllMovies);
    localStorage.setItem("allMovies", JSON.stringify(updatedAllMovies));
  };

  // Удаление фильма (ИСПРАВЛЕННАЯ ВЕРСИЯ)
  const handleMovieDelete = (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить фильм?")) return;

    // Удаляем из фильмов пользователя
    const updatedUserMovies = currentUser.movies.filter(movie => movie.id !== id);
    const updatedUser = { ...currentUser, movies: updatedUserMovies };
    setCurrentUser(updatedUser);

    // Обновляем пользователей
    const updatedUsers = users.map(u => 
      u.id === updatedUser.id ? updatedUser : u
    );
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Удаляем из всех фильмов
    const updatedAllMovies = allMovies.filter(movie => movie.id !== id);
    setAllMovies(updatedAllMovies);
    localStorage.setItem("allMovies", JSON.stringify(updatedAllMovies));

    // ОБНОВЛЯЕМ ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ В LOCALSTORAGE
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  };

  if (!currentUser)
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">
        Вы не вошли в систему.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Профиль</h1>

      {/* Изменение имени и аватарки */}
      <div className="mb-6 flex items-center space-x-4">
        <img
          src={avatar || "https://via.placeholder.com/80"}
          alt="avatar"
          className="w-20 h-20 rounded-full object-cover border border-gray-700"
        />
        <div className="flex flex-col space-y-2">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="p-2 rounded bg-gray-800 text-white border border-gray-700"
            placeholder="Имя"
          />
          <input
            type="text"
            value={avatar}
            onChange={e => setAvatar(e.target.value)}
            className="p-2 rounded bg-gray-800 text-white border border-gray-700"
            placeholder="URL аватарки"
          />
          <button
            onClick={handleProfileSave}
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-500 w-max"
          >
            Сохранить профиль
          </button>
        </div>
      </div>

      {/* Фильмы текущего пользователя */}
      <h2 className="text-2xl font-bold mb-4">Ваши фильмы</h2>
      {currentUser.movies.length === 0 ? (
        <p>Вы ещё не добавили ни одного фильма.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentUser.movies.map(movie => (
            <div
              key={movie.id}
              className="bg-gray-800 p-4 rounded-lg flex flex-col"
            >
              <img
                src={movie.thumbnail || "https://via.placeholder.com/400x225?text=No+Image"}
                alt={movie.title}
                className="w-full h-48 object-cover rounded mb-2"
              />
              <input
                type="text"
                value={movie.title}
                onChange={e =>
                  handleMovieChange(movie.id, "title", e.target.value)
                }
                className="p-1 rounded bg-gray-700 text-white border border-gray-600 mb-1"
              />
              <textarea
                value={movie.description}
                onChange={e =>
                  handleMovieChange(movie.id, "description", e.target.value)
                }
                className="p-1 rounded bg-gray-700 text-white border border-gray-600 mb-2"
              />
              <div className="flex justify-between">
                <button
                  onClick={() => handleMovieDelete(movie.id)}
                  className="px-2 py-1 bg-red-600 rounded hover:bg-red-500"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}