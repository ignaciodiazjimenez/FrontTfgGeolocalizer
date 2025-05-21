// src/components/Sidebar.jsx
import React from "react";
import { getUserRole, logout } from "../utils/api";

export default function Sidebar({ currentPath }) {
  const role = getUserRole();

  const menus = {
    cliente: [
      { label: "Inicio", to: "/cliente", icon: "🏠" },
      { label: "Dispositivos", to: "/cliente", icon: "📟" },
      { label: "Mapa", to: "/mapa", icon: "🗺️" },
      { label: "Noticias", to: "/noticias", icon: "📰" },
      { label: "Quiénes somos", to: "/quienes-somos", icon: "ℹ️" },
    ],
    admin: [
      { label: "Inicio", to: "/admin", icon: "🏠" },
      { label: "Gestionar Clientes", to: "/admin/clientes", icon: "👥" },
      { label: "Gestionar Dispositivos", to: "/admin/dispositivos", icon: "📟" },
      { label: "Tickets de incidencias", to: "/admin/tickets", icon: "🎫" },
    ],
  };

  const menuItems = menus[role] || [];

  function handleLogout() {
    logout();
    // Redirige a la página de bienvenida en lugar de /login
    window.location.href = "/";
  }

  return (
    <nav className="fixed top-0 left-0 h-full w-52 bg-primary-light text-accent-dark p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-8">Menú</h2>
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = currentPath === item.to;
            return (
              <li key={item.to}>
                <a
                  href={item.to}
                  className={`flex items-center space-x-2 px-3 py-2 rounded ${
                    isActive
                      ? "bg-accent-primary text-white"
                      : "hover:bg-accent-primary/50"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <button
        onClick={handleLogout}
        className="mt-4 flex items-center space-x-2 text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded"
      >
        <span>🔒</span>
        <span>Cerrar sesión</span>
      </button>
    </nav>
  );
}
