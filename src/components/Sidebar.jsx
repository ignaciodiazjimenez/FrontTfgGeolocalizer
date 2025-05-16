import React from "react";
import { LogOut, Home, BookOpen, Users, Settings } from "lucide-react";
import { getUserRole, logout } from "../utils/api";

const Sidebar = () => {
  const role = getUserRole(); // obtener el rol desde el token

  const links = [
    { label: "Inicio", href: "/", icon: <Home size={18} /> },
    { label: "Catálogo", href: "/catalogo", icon: <BookOpen size={18} /> },
    { label: "Investigación", href: "/investigacion", icon: <Users size={18} /> },
  ];

  // Si el usuario es administrador, añadimos el panel de admin
  if (role === "admin") {
    links.push({
      label: "Panel Admin",
      href: "/admin",
      icon: <Settings size={18} />,
    });
  }

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-56 bg-gradient-to-b from-accent-primary to-primary-dark text-white shadow-lg flex flex-col justify-between z-30">
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-bold text-white mb-6 tracking-wide">Menú</h2>

        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-white/10 transition-all"
          >
            {link.icon}
            <span>{link.label}</span>
          </a>
        ))}
      </div>

      <div className="p-6 border-t border-white/20">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-white hover:text-red-400 transition"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
