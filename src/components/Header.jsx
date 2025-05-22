// src/components/Header.jsx
import React from "react";

export default function Header() {
  return (
    <header
      className="
        fixed top-0 left-52 right-0 h-16
        bg-white/80 dark:bg-gray-800/80
        backdrop-blur flex items-center justify-between
        px-8 shadow
      "
    >
      <h1 className="text-2xl font-bold text-primary-dark dark:text-primary-light">
        Geolocalizer
      </h1>

      <div className="flex items-center space-x-4">
        {/* Botón de cambiar idioma */}
        <button
          aria-label="Cambiar idioma"
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          🌐
        </button>

        {/* Botón de tema oscuro/claro */}
        <button
          aria-label="Cambiar tema"
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => {
            document.documentElement.classList.toggle("dark");
          }}
        >
          {document.documentElement.classList.contains("dark") ? "🌙" : "☀️"}
        </button>
      </div>
    </header>
  );
}
