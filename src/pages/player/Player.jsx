import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

export default function VideoPlayer() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const [reportingCommentId, setReportingCommentId] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const videoRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    // Загрузка данных о фильме
    const allMovies = JSON.parse(localStorage.getItem("allMovies")) || [];
    const foundMovie = allMovies.find(m => m.id === parseInt(id));
    setMovie(foundMovie);

    // Загрузка комментариев
    const storedComments = JSON.parse(localStorage.getItem("comments")) || {};
    setComments(storedComments[id] || []);
  }, [id]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;

    if (!currentUser) {
      alert("Войдите в систему, чтобы оставлять комментарии");
      return;
    }

    const comment = {
      id: Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      text: newComment.trim(),
      timestamp: new Date().toLocaleString(),
      edited: false,
      reports: []
    };

    const updatedComments = [...(comments || []), comment];
    setComments(updatedComments);
    
    // Сохраняем комментарии в localStorage
    const allComments = JSON.parse(localStorage.getItem("comments")) || {};
    allComments[id] = updatedComments;
    localStorage.setItem("comments", JSON.stringify(allComments));
    
    setNewComment("");
  };

  const startEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.text);
  };

  const saveEditComment = () => {
    if (!editText.trim()) return;

    const updatedComments = comments.map(comment =>
      comment.id === editingCommentId
        ? { ...comment, text: editText.trim(), edited: true }
        : comment
    );

    setComments(updatedComments);
    
    // Сохраняем изменения в localStorage
    const allComments = JSON.parse(localStorage.getItem("comments")) || {};
    allComments[id] = updatedComments;
    localStorage.setItem("comments", JSON.stringify(allComments));
    
    setEditingCommentId(null);
    setEditText("");
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditText("");
  };

  const deleteComment = (commentId) => {
    if (!window.confirm("Вы уверены, что хотите удалить комментарий?")) return;

    const updatedComments = comments.filter(comment => comment.id !== commentId);
    setComments(updatedComments);
    
    // Сохраняем изменения в localStorage
    const allComments = JSON.parse(localStorage.getItem("comments")) || {};
    allComments[id] = updatedComments;
    localStorage.setItem("comments", JSON.stringify(allComments));
  };

  const openReportModal = (commentId) => {
    setReportingCommentId(commentId);
    setReportReason("");
  };

  const closeReportModal = () => {
    setReportingCommentId(null);
    setReportReason("");
  };

  const submitReport = () => {
    if (!reportReason.trim()) {
      alert("Пожалуйста, укажите причину жалобы");
      return;
    }

    const updatedComments = comments.map(comment =>
      comment.id === reportingCommentId
        ? {
            ...comment,
            reports: [
              ...(comment.reports || []),
              {
                userId: currentUser.id,
                reason: reportReason.trim(),
                timestamp: new Date().toLocaleString()
              }
            ]
          }
        : comment
    );

    setComments(updatedComments);
    
    // Сохраняем изменения в localStorage
    const allComments = JSON.parse(localStorage.getItem("comments")) || {};
    allComments[id] = updatedComments;
    localStorage.setItem("comments", JSON.stringify(allComments));
    
    // Также сохраняем жалобу в отдельном хранилище для модерации
    const allReports = JSON.parse(localStorage.getItem("reports")) || [];
    const report = {
      id: Date.now(),
      commentId: reportingCommentId,
      videoId: id,
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      reason: reportReason.trim(),
      timestamp: new Date().toLocaleString()
    };
    localStorage.setItem("reports", JSON.stringify([...allReports, report]));
    
    alert("Жалоба отправлена. Спасибо за вашу бдительность!");
    closeReportModal();
  };

  if (!movie) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Фильм не найден</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Видеоплеер */}
        <div className="mb-6">
          <video
            ref={videoRef}
            controls
            className="w-full h-auto max-h-96 bg-black"
            poster={movie.thumbnail}
          >
            <source src={movie.videoUrl} type="video/mp4" />
            Ваш браузер не поддерживает видео тег.
          </video>
        </div>

        {/* Информация о фильме */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{movie.title}</h1>
          <p className="text-gray-400 mb-2">Автор: {movie.author}</p>
          <p className="text-gray-400 mb-4">Дата: {movie.date}</p>
          <p className="text-gray-300">{movie.description}</p>
        </div>

        {/* Форма комментария */}
        {currentUser && (
          <div className="mb-6">
            <form onSubmit={handleCommentSubmit} className="flex flex-col">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Оставьте комментарий..."
                className="p-3 rounded bg-gray-800 text-white border border-gray-700 mb-2 resize-none"
                rows="3"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded self-end"
              >
                Отправить
              </button>
            </form>
          </div>
        )}

        {/* Список комментариев */}
        <div>
          <h2 className="text-xl font-bold mb-4">Комментарии</h2>
          {comments && comments.length > 0 ? (
            comments.map(comment => (
              <div key={comment.id} className="bg-gray-800 p-4 rounded-lg mb-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <img
                      src={comment.userAvatar || "https://via.placeholder.com/40"}
                      alt="avatar"
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="font-semibold">{comment.userName}</span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {comment.timestamp}
                    {comment.edited && " (ред.)"}
                  </span>
                </div>
                
                {editingCommentId === comment.id ? (
                  <div className="mb-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 mb-2"
                      rows="3"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={cancelEditComment}
                        className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded"
                      >
                        Отмена
                      </button>
                      <button
                        onClick={saveEditComment}
                        className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded"
                      >
                        Сохранить
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-300 mb-2">{comment.text}</p>
                )}
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-400">
                    {comment.reports && comment.reports.length > 0 && 
                      `Жалоб: ${comment.reports.length}`
                    }
                  </div>
                  
                  <div className="flex space-x-2">
                    {currentUser && currentUser.id === comment.userId && (
                      <>
                        <button
                          onClick={() => startEditComment(comment)}
                          className="text-sm text-blue-400 hover:text-blue-300"
                        >
                          Редактировать
                        </button>
                        <button
                          onClick={() => deleteComment(comment.id)}
                          className="text-sm text-red-400 hover:text-red-300"
                        >
                          Удалить
                        </button>
                      </>
                    )}
                    
                    {currentUser && currentUser.id !== comment.userId && (
                      <button
                        onClick={() => openReportModal(comment.id)}
                        className="text-sm text-yellow-400 hover:text-yellow-300"
                      >
                        Пожаловаться
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">Комментариев пока нет</p>
          )}
        </div>
      </div>

      {/* Модальное окно жалобы */}
      {reportingCommentId && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Отправка жалобы</h3>
            <p className="text-gray-300 mb-4">
              Пожалуйста, укажите причину жалобы на этот комментарий.
            </p>
            
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Причина жалобы..."
              className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 mb-4 resize-none"
              rows="3"
            />
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeReportModal}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded"
              >
                Отмена
              </button>
              <button
                onClick={submitReport}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded"
              >
                Отправить жалобу
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}