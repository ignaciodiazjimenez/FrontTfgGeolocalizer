import React, { useState, useEffect } from "react";

export default function Header() {
  const [dark, setDark] = useState(false);

  // Sincroniza estado con la clase ya inyectada en <html>
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  // Cuando dark cambie, actualiza <html> y localStorage
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <header
      className="
        w-full sticky top-0 z-20
        px-8 py-3 flex items-center justify-between rounded-b-xl

        bg-gradient-to-r from-primary-light via-accent-primary to-primary-light
        dark:bg-gradient-to-r dark:from-accent-primary dark:via-primary-dark dark:to-accent-primary

        backdrop-blur-md
        border-b border-white/30 dark:border-accent-dark/30
        shadow-md
      "
    >
      <h1 className="text-3xl font-extrabold text-[#2F3E2E] dark:text-white">
        Geolocalizer
      </h1>

      <div className="flex items-center space-x-4">
        <button
          aria-label="Cambiar tema"
          onClick={() => setDark((d) => !d)}
          className="
            text-lg p-2 rounded-full
            hover:bg-accent-primary/30 dark:hover:bg-accent-hover
            transition text-accent-dark dark:text-white
          "
        >
          {dark ? "🌙" : "☀️"}
        </button>

        {/* Botón Contáctanos con pulso lento en hover */}
        <a
          href="https://hagalink.es"
          target="_blank"
          rel="noopener"
          className="group relative inline-block"
        >
          {/* Ping lento on hover: 5s duration */}
          <span
            className="pointer-events-none absolute inset-0 rounded-md border-2 border-[#2F3E2E] opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:animate-[ping_1s_linear_infinite]"
          />
          <span
            className="relative px-4 py-2 bg-[#2F3E2E] text-white rounded-md hover:bg-opacity-80 transition"
          >
            Contáctanos
          </span>
        </a>
      </div>
    </header>
  );
}
