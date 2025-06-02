import React, { useState } from "react";
import { getUserRole, logout } from "../utils/api";

export default function Sidebar({ currentPath }) {
  /* ─── Menús por rol ─── */
  const role  = getUserRole();            // "user" | "admin"
  const menus = {
    user: [
      { label: "Inicio",        to: "/cliente",               icon: "🏠" },
      { label: "Dispositivos",  to: "/cliente/dispositivos",  icon: "📟" },
      { label: "Mapa",          to: "/cliente/mapa",          icon: "🗺️" },
      { label: "Noticias",      to: "/cliente/noticias",      icon: "📰" },
      { label: "Quiénes somos", to: "/cliente/quienes-somos", icon: "ℹ️" },
    ],
    admin: [
      { label: "Inicio",                 to: "/admin",              icon: "🏠" },
      { label: "Gestionar Clientes",     to: "/admin/clientes",     icon: "👥" },
      { label: "Gestionar Dispositivos", to: "/admin/dispositivos", icon: "📟" },
      { label: "Tickets de incidencias", to: "/admin/tickets",      icon: "🎫" },
    ],
  };
  const menuItems = menus[role] ?? [];

  /* ─── logout ─── */
  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  /* ─── render ─── */
  return (
    /* “group” nos permite usar group-hover en hijos */
    <div className="group/sidebar fixed inset-y-0 left-0 z-30">
      {/* --- Botón hamburguesa (solo visible < md) ------------------ */}
      <button
        onClick={() =>
          document
            .querySelector("#drawer")
            ?.classList.toggle("-translate-x-full")
        }
        className="
          md:hidden absolute top-4 left-4 z-40
          p-2 rounded-md bg-primary-light/70 backdrop-blur
        "
      >
        🍔
      </button>

      {/* --- Drawer -------------------------------------------------- */}
      <aside
        id="drawer"
        /*  ➜  desktop: queda 12 px dentro de la pantalla  
            ➜  <md  : fuera, se muestra solo con el botón          */
        className="
          h-full w-56
          -translate-x-[calc(100%-12px)] md:-translate-x-3
          group-hover/sidebar:translate-x-0 md:group-hover/sidebar:-translate-x-0
          md:static fixed
          transition-transform duration-300
          flex flex-col justify-between
          px-5 py-8
          bg-primary-light/80 dark:bg-accent-dark/60 backdrop-blur-md
          border-r border-white/30 dark:border-accent-dark/30 shadow-lg
        "
      >
        {/* Menú ---------------------------------------------------- */}
        <div className="space-y-8">
          <h2 className="text-xl font-extrabold tracking-wide">Menú</h2>

          <ul className="space-y-1.5">
            {menuItems.map(({ label, to, icon }) => {
              const active = currentPath === to;
              return (
                <li key={to}>
                  <a
                    href={to}
                    className={`
                      flex items-center gap-3
                      px-4 py-2 rounded-lg font-medium
                      transition-colors
                      ${active
                        ? "bg-accent-primary text-accent-dark shadow"
                        : "hover:bg-accent-primary/30"}
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

        {/* Logout --------------------------------------------------- */}
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
