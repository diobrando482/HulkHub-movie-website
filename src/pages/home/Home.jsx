import React, { useState, useEffect } from "react";
import VideoCard from "../../components/videoСard/VideoCard";
import { Link } from "react-router-dom";
import Modal from "../../components/auth/AuthModal"; // твоя модалка

export default function Home() {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );
  const [allMovies, setAllMovies] = useState(
    JSON.parse(localStorage.getItem("allMovies")) || []
  );
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage] = useState(20);

  // модалка
  const [isAddMovieOpen, setIsAddMovieOpen] = useState(false);
  const [movieTitle, setMovieTitle] = useState("");
  const [movieDescription, setMovieDescription] = useState("");
  const [movieThumbnail, setMovieThumbnail] = useState("");
  const [movieVideoUrl, setMovieVideoUrl] = useState("");

  useEffect(() => {
    // если нет текущего пользователя → нельзя добавлять фильм
    if (!currentUser) setIsAddMovieOpen(false);
  }, [currentUser]);

  const handleAddMovie = (e) => {
    e.preventDefault();
    if (!movieTitle || !movieDescription || !movieVideoUrl) {
      return alert("Введите название, описание и ссылку на видео!");
    }
    

    const newMovie = {
      id: Date.now(),
      userId: currentUser.id,
      title: movieTitle,
      description: movieDescription,
      thumbnail:
        movieThumbnail || `https://picsum.photos/seed/movie${Date.now()}/400/600`,
      videoUrl: movieVideoUrl,
      author: currentUser.name,
      date: new Date().toLocaleString(),
    };

    const updatedAllMovies = [...allMovies, newMovie];
    setAllMovies(updatedAllMovies);
    localStorage.setItem("allMovies", JSON.stringify(updatedAllMovies));

    // обновляем фильмы текущего пользователя
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((u) =>
      u.id === currentUser.id
        ? { ...u, movies: [...(u.movies || []), newMovie] }
        : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    const updatedCurrentUser = {
      ...currentUser,
      movies: [...(currentUser.movies || []), newMovie],
    };
    setCurrentUser(updatedCurrentUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));

    setMovieTitle("");
    setMovieDescription("");
    setMovieThumbnail("");
    setMovieVideoUrl("");
    setIsAddMovieOpen(false);
  };

  // Функция удаления фильма
  const handleDeleteMovie = (movieId) => {
    if (!currentUser) return;
    
    const movieToDelete = allMovies.find(movie => movie.id === movieId);
    
    // Проверяем права на удаление
    if (movieToDelete.userId !== currentUser.id) {
      alert("Вы можете удалять только свои фильмы!");
      return;
    }

    const updatedAllMovies = allMovies.filter(movie => movie.id !== movieId);
    setAllMovies(updatedAllMovies);
    localStorage.setItem("allMovies", JSON.stringify(updatedAllMovies));

    // Обновляем данные пользователя
    const updatedUserMovies = currentUser.movies
      ? currentUser.movies.filter(movie => movie.id !== movieId)
      : [];
    
    const updatedCurrentUser = {
      ...currentUser,
      movies: updatedUserMovies
    };
    
    setCurrentUser(updatedCurrentUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));

    // Обновляем данные в users
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map(user =>
      user.id === currentUser.id
        ? { ...user, movies: updatedUserMovies }
        : user
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  // фильтрация
  const filteredMovies = allMovies.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  // пагинация
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(
    indexOfFirstMovie,
    indexOfLastMovie
  );
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">
      {/* поиск + добавить фильм */}
      <div className="w-full max-w-7xl p-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Поиск фильмов..."
          className="w-full md:w-96 p-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {currentUser && (
          <button
            onClick={() => setIsAddMovieOpen(true)}
            className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
          >
            ➕ Добавить фильм
          </button>
        )}
      </div>

      {/* сетка фильмов */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-6 w-full max-w-7xl">
        {currentMovies.length > 0 ? (
          currentMovies.map((movie) => (
            <div key={movie.id} className="relative group">
              <Link to={`/video/${movie.id}`}>
                <VideoCard movie={movie} />
              </Link>
              
              {/* Кнопка удаления */}
              {currentUser && currentUser.id === movie.userId && (
                <button
                  onClick={() => handleDeleteMovie(movie.id)}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-500 rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Удалить фильм"
                >
                  ×
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400">
            Фильмы не найдены 😔
          </div>
        )}
      </div>

      {/* пагинация */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 my-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Назад
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === i + 1
                  ? "bg-blue-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Вперед
          </button>
        </div>
      )}

      {/* модалка добавления фильма */}
      <Modal
        isOpen={isAddMovieOpen}
        onClose={() => setIsAddMovieOpen(false)}
        title="Добавить фильм"
      >
        <form
          className="flex flex-col space-y-3"
          onSubmit={handleAddMovie}
        >
          <input
            value={movieTitle}
            onChange={(e) => setMovieTitle(e.target.value)}
            placeholder="Название фильма"
            className="p-2 rounded bg-gray-800 text-white border border-gray-700"
          />
          <input
            value={movieDescription}
            onChange={(e) => setMovieDescription(e.target.value)}
            placeholder="Описание"
            className="p-2 rounded bg-gray-800 text-white border border-gray-700"
          />
          <input
            value={movieThumbnail}
            onChange={(e) => setMovieThumbnail(e.target.value)}
            placeholder="URL миниатюры (необязательно)"
            className="p-2 rounded bg-gray-800 text-white border border-gray-700"
          />
          <input
            value={movieVideoUrl}
            onChange={(e) => setMovieVideoUrl(e.target.value)}
            placeholder="Ссылка на видео (mp4)"
            className="p-2 rounded bg-gray-800 text-white border border-gray-700"
          />
          <button
            type="submit"
            className="bg-blue-600 py-2 rounded-lg hover:bg-blue-500"
          >
            Добавить
          </button>
        </form>
      </Modal>
    </div>
  );
}