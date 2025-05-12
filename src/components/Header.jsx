import React from "react";

export default function Header() {
  return (
    <nav className="relative z-20 flex gap-4 px-8 py-3 rounded-full bg-gradient-to-r from-primary-light to-accent-dark/80 shadow-lg backdrop-blur-md">
      <a className="text-sm font-semibold text-white hover:underline" href="/">Inicio</a>
      <a className="text-sm font-semibold text-white hover:underline" href="/conocenos">Conócenos</a>
      <a className="text-sm font-semibold text-white hover:underline" href="/catalogo">Catálogo</a>
      <a className="text-sm font-semibold text-white hover:underline" href="/investigacion">Investigación</a>
    </nav>
  );
}
