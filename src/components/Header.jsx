import React, { useState, useEffect } from "react";

export default function Header() {
  const [dark, setDark] = useState(false);

  /* ⬇️ Al montar, comprobamos si está activado el modo oscuro */
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  /* ⬇️ Alternar tema */
  function toggleTheme() {
    document.documentElement.classList.toggle("dark");
    setDark((prev) => !prev);
  }

  return (
    <header
      className="
        w-full sticky top-0 z-20
        px-8 py-3
        flex items-center justify-between
        rounded-b-xl
        bg-white/40 dark:bg-accent-dark/60
        backdrop-blur-md
        border-b border-white/30 dark:border-accent-dark/30
        shadow-md
      "
    >
      {/* Marca ---------------------------------------------------------- */}
      <h1
        className="
          text-lg sm:text-xl font-extrabold tracking-wide
          text-transparent bg-gradient-to-r
          from-accent-dark via-primary-dark to-accent-primary
          dark:from-accent-primary dark:to-primary-light
          bg-clip-text
          drop-shadow-sm
        "
      >
        Geolocalizer
      </h1>

      {/* Controles ------------------------------------------------------ */}
      <div className="flex items-center gap-4">
        {/* (ejemplo estático) ⚑ idioma */}
        <button
          aria-label="Cambiar idioma"
          className="
            text-sm font-semibold
            px-3 py-1 rounded-full
            hover:bg-accent-primary/30
            transition
          "
        >
          EN
        </button>

        {/* ☀/🌙 modo claro-oscuro */}
        <button
          aria-label="Cambiar tema"
          onClick={toggleTheme}
          className="
            text-lg
            p-2 rounded-full
            hover:bg-accent-primary/30
            transition
          "
        >
          {dark ? "🌙" : "☀️"}
        </button>
      </div>
    </header>
  );
}
