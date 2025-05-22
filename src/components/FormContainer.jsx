import React from "react";

/**
 * FormContainer
 *
 * Un “wrapper” para formularios, con fondo semi-transparente,
 * bordes redondeados, sombra, y animaciones de entrada.
 *
 * Props
 * ─────────
 * • title     → título de la tarjeta (e.g. "Login", "Registro").
 * • children  → campos y botones del formulario.
 */
export default function FormContainer({
  title = "Formulario",
  children,
}) {
  return (
    <div className="relative w-full max-w-md mx-auto my-8">
      {/* Brillo + sonar detrás */}
      <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 hover:blur-md bg-accent-primary transition-all duration-500 animate-glow border border-accent-primary pointer-events-none" />
      <div className="absolute inset-0 rounded-xl border-2 border-accent-primary opacity-50 animate-pulse-sonar pointer-events-none" />

      {/* Contenido */}
      <div className="relative bg-white/30 backdrop-blur-md rounded-xl p-8 text-accent-dark border border-white/50 shadow-xl z-10 animate-fade-in-up">
        <h2 className="text-2xl font-semibold text-center mb-6">{title}</h2>
        {children}
      </div>
    </div>
  );
}
