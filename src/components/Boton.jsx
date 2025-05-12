import React from "react";

/**
 * Botón verde con contorno giratorio.
 *
 * Props
 * ─────────
 * • texto   → etiqueta a mostrar.
 * • href    → ruta a la que navegar.
 * • onClick → callback opcional (por defecto, función vacía).
 * • className → clases Tailwind extra.
 */
export default function Boton({
  texto = "Botón",
  href = "#",
  onClick = () => {},          // ← ahora es opcional
  className = "",
}) {
  const handleClick = (e) => {
    onClick(e);                // ejecuta callback (si lo hay)
    window.location.href = href;
  };

  return (
    <div className={`relative group inline-block ${className}`}>
      {/* contorno giratorio */}
      <div className="absolute inset-0 rounded-full border-2 border-accent-primary opacity-50 animate-spin-slow group-hover:opacity-100 pointer-events-none" />

      {/* botón */}
      <button
        onClick={handleClick}
        className="relative z-10 bg-accent-primary px-5 py-2 font-bold rounded-full shadow-md hover:bg-accent-hover hover:scale-105 hover:shadow-lg transition-all duration-300 text-black"
      >
        {texto}
      </button>
    </div>
  );
}
