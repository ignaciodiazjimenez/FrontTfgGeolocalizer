import React from "react";
import { getUserRole, logout } from "../utils/api";

export default function Sidebar({ currentPath }) {
  const role = getUserRole();           // ← ahora esperamos "user" o "admin"

  /* Menús por rol -------------------------------------------------------- */
  const menus = {
    /*  ─────  CLIENTE  ─────  */
    user: [
      { label: "Inicio",        to: "/cliente",               icon: "🏠" },
      { label: "Dispositivos",  to: "/cliente/dispositivos",  icon: "📟" },
      { label: "Mapa",          to: "/cliente/mapa",          icon: "🗺️" },
      { label: "Noticias",      to: "/cliente/noticias",      icon: "📰" },
      { label: "Quiénes somos", to: "/cliente/quienes-somos", icon: "ℹ️" },
    ],

    /*  ─────  ADMIN  ─────  */
    admin: [
      { label: "Inicio",                 to: "/admin",              icon: "🏠" },
      { label: "Gestionar Clientes",     to: "/admin/clientes",     icon: "👥" },
      { label: "Gestionar Dispositivos", to: "/admin/dispositivos", icon: "📟" },
      { label: "Tickets de incidencias", to: "/admin/tickets",      icon: "🎫" },
    ],
  };

  const menuItems = menus[role] || [];

  /* Logout -------------------------------------------------------------- */
  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  /* Render -------------------------------------------------------------- */
  return (
    <nav className="fixed top-0 left-0 h-full w-52 bg-primary-light text-accent-dark p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-6">Menú</h2>

        <ul className="space-y-3">
          {menuItems.map((item) => {
            const isActive = currentPath === item.to;
            return (
              <li key={item.to}>
                <a
                  href={item.to}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
                    ${isActive
                      ? "bg-accent-primary text-white"
                      : "hover:bg-accent-primary/50"}`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <button
        onClick={handleLogout}
        className="mt-8 flex items-center space-x-2 justify-center bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
      >
        <span>🔒</span>
        <span>Cerrar sesión</span>
      </button>
    </nav>
  );
}
