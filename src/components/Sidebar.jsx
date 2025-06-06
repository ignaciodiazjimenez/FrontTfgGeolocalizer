// src/components/Sidebar.jsx
import React from "react";
import { getUserRole, logout } from "../utils/api";

export default function Sidebar({ currentPath }) {
  // Obtenemos el rol del usuario autenticado: "user" | "admin" | "root"
  const role = getUserRole();

  // Definimos los menús para cada rol
  const menus = {
    user: [
      { label: "Inicio",       to: "/cliente",              icon: "🏠" },
      { label: "Dispositivos", to: "/cliente/dispositivos", icon: "📟" },
      { label: "Mapa",         to: "/cliente/mapa",         icon: "🗺️" },
    ],
    admin: [
      { label: "Inicio",            to: "/admin",              icon: "🏠" },
      { label: "Gestión Usuarios",  to: "/admin/usuarios",     icon: "👥" },
      { label: "Dispositivos",      to: "/cliente/dispositivos", icon: "📟" },
      { label: "Mapa",              to: "/cliente/mapa",         icon: "🗺️" },
    ],
    root: [
      { label: "Inicio",            to: "/admin",              icon: "🏠" },
      { label: "Gestión Usuarios",  to: "/admin/usuarios",     icon: "👥" },
      { label: "Dispositivos",      to: "/cliente/dispositivos", icon: "📟" },
      { label: "Mapa",              to: "/cliente/mapa",         icon: "🗺️" },
    ],
  };

  // Seleccionamos el array de items según el rol actual
  const menuItems = menus[role] ?? [];

  // Función de logout
  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div className="group/sidebar fixed inset-y-0 left-0 z-30">
      {/* Botón hamburguesa (visible solo en pantallas < md) */}
      <button
        onClick={() =>
          document
            .querySelector("#drawer")
            ?.classList.toggle("-translate-x-full")
        }
        className="
          md:hidden absolute top-4 left-4 z-40
          p-2 rounded-md bg-accent-primary/70 dark:bg-accent-primary/70 backdrop-blur
        "
      >
        ☰
      </button>

      {/* Drawer */}
      <aside
        id="drawer"
        className="
          h-full w-56
          -translate-x-[calc(100%-12px)] md:-translate-x-3
          group-hover/sidebar:translate-x-0 md:group-hover/sidebar:-translate-x-0
          md:static fixed
          transition-transform duration-300
          flex flex-col justify-between
          px-5 py-8
          bg-gradient-to-b from-accent-primary via-primary-light to-accent-primary
          dark:bg-gradient-to-b dark:from-accent-primary dark:via-accent-primary dark:to-primary-dark
          backdrop-blur-md
          border-r border-white/30 dark:border-accent-dark/30
          shadow-lg
        "
      >
        {/* Menú principal */}
        <div className="space-y-8">
          <h2 className="text-xl font-extrabold tracking-wide text-accent-dark dark:text-white">
            Menú
          </h2>

          <ul className="space-y-1.5">
            {menuItems.map(({ label, to, icon }) => {
              const active = currentPath === to;
              return (
                <li key={to}>
                  <a
                    href={to}
                    className={`
                      flex items-center gap-3
                      px-4 py-2 rounded-lg font-medium transition-colors
                      ${active
                        ? "bg-white/30 text-accent-dark dark:text-accent-dark shadow-md"
                        : "hover:bg-accent-primary/30 text-accent-dark dark:text-white"}
                    `}
                  >
                    <span>{icon}</span>
                    <span>{label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Botón de cerrar sesión */}
        <button
          onClick={handleLogout}
          className="
            flex items-center justify-center gap-2
            px-4 py-2 rounded-lg
            bg-red-500 text-white hover:bg-red-600
            transition-colors
          "
        >
          🔒 Cerrar sesión
        </button>
      </aside>
    </div>
  );
}
