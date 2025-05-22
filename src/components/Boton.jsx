import React from "react";

/**
 * Botón con pulso-sonar + contorno giratorio.
 *
 * Props
 * • texto     → etiqueta a mostrar.
 * • href      → ruta a la que navegar.
 * • className → clases extra.
 */
export default function Boton({ texto = "Botón", href = "#", className = "" }) {
  return (
    <a href={href} className={`relative group inline-block ${className}`}>
      {/* pulso-sonar detrás */}
      <span className="absolute inset-0 rounded-full bg-accent-primary/40 animate-pulse-sonar pointer-events-none"></span>
      {/* contorno giratorio */}
      <span className="absolute inset-0 rounded-full border-2 border-accent-primary opacity-50 animate-spin-slow group-hover:opacity-100 pointer-events-none"></span>
      {/* botón encima */}
      <span className="relative z-10 block bg-accent-primary px-5 py-2 font-bold rounded-full shadow-md
                       hover:bg-accent-hover hover:scale-105 hover:shadow-lg transition-all duration-300 text-black">
        {texto}
      </span>
    </a>
  );
}
