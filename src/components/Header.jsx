// src/components/Header.jsx
import React, { useState, useEffect } from "react";

export default function Header() {
  const [dark, setDark] = useState(false);

  // Al montar, comprobamos si el <html> ya tiene la clase "dark"
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);

  // Alternar tema claro ↔ oscuro
  function toggleTheme() {
    const root = document.documentElement;
    if (root.classList.contains("dark")) {
      root.classList.remove("dark");
      setDark(false);
    } else {
      root.classList.add("dark");
      setDark(true);
    }
  }

  return (
    <header
      className="
        w-full sticky top-0 z-20
        px-8 py-3
        flex items-center justify-between
        rounded-b-xl

        /* Gradiente horizontal: izquierda clara → derecha oscura */
        bg-gradient-to-r 
          from-primary-light via-accent-primary to-primary-light
        dark:bg-gradient-to-r 
          dark:from-accent-primary dark:via-primary-dark dark:to-accent-primary

        backdrop-blur-md
        border-b border-white/30 dark:border-accent-dark/30
        shadow-md
      "
    >
      {/* ─── Marca ────────────────────────────── */}
      <h1 className="text-3xl font-extrabold text-[#2F3E2E] dark:text-white">
        Geolocalizer
      </h1>

      {/* ─── Controles ───────────────────────── */}
      <div className="flex items-center gap-4">
        {/* Cambiar idioma (estático) ⚑ */}
        <button
          aria-label="Cambiar idioma"
          className="
            text-sm font-semibold
            px-3 py-1 rounded-full
            hover:bg-accent-primary/30 dark:hover:bg-accent-hover
            transition
            text-accent-dark dark:text-white
          "
        >
          EN
        </button>

        {/* ☀️ / 🌙 modo claro‐oscuro */}
        <button
          aria-label="Cambiar tema"
          onClick={toggleTheme}
          className="
            text-lg
            p-2 rounded-full
            hover:bg-accent-primary/30 dark:hover:bg-accent-hover
            transition
            text-accent-dark dark:text-white
          "
        >
          {dark ? "🌙" : "☀️"}
        </button>
      </div>
    </header>
  );
}
