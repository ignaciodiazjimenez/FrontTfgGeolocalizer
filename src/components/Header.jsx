import React, { useState, useEffect } from "react";

export default function Header() {
  const [dark, setDark] = useState(false);

  // Al montar en el cliente, comprobamos si ya está el modo dark
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);

  // Toggle al hacer click
  function toggleTheme() {
    document.documentElement.classList.toggle("dark");
    setDark((prev) => !prev);
  }

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-primary-light dark:bg-primary-dark">
      <h1 className="text-2xl font-bold">Geolocalizer</h1>
      <div className="flex items-center space-x-4">
        {/* Botón cambiar idioma (ejemplo estático) */}
        <button
          aria-label="Cambiar idioma"
          className="p-2 rounded hover:bg-accent-hover transition"
        >
          EN
        </button>
        {/* Botón oscuro/clarro */}
        <button
          aria-label="Cambiar tema"
          className="p-2 rounded hover:bg-accent-hover transition"
          onClick={toggleTheme}
        >
          {dark ? "🌙" : "☀️"}
        </button>
      </div>
    </header>
  );
}
