import React from "react";

export default function Modal({ isOpen, onClose, title, children, overlayOpacity = 50 }) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition-opacity"
      style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity / 100})` }}
    >
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-fadeIn">
        <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
        <div>{children}</div>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl"
        >
          ×
        </button>
      </div>
    </div>
  );
}