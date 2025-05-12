import React from "react";

/**
 * Botón verde con borde giratorio (como en el proyecto antiguo).
 */
export default function Boton({ texto = "Botón", onClick, className = "" }) {
  return (
    <div className="relative group inline-block">
      {/* aro giratorio */}
      <div className="absolute inset-0 rounded-full border-2 border-accent-primary opacity-60 animate-spin-slow group-hover:opacity-100 pointer-events-none" />

      <button
        onClick={onClick}
        className={`relative z-10 bg-accent-primary px-6 py-2 font-bold rounded-full shadow-md hover:bg-accent-hover hover:scale-105 hover:shadow-lg transition-all duration-300 text-black ${className}`}
      >
        {texto}
      </button>
    </div>
  );
}
