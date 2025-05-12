import React, { useState, useEffect } from "react";

const links = [
  { label: "Inicio",        href: "/" },
  { label: "Conócenos",     href: "/conocenos" },
  { label: "Catálogo",      href: "/catalogo" },
  { label: "Investigación", href: "/investigacion" },
];

export default function Sidebar() {
  const [active, setActive] = useState("/");

  useEffect(() => {
    setActive(window.location.pathname);
  }, []);

  return (
    <aside className="fixed inset-y-0 left-0 w-52 shadow-lg z-30
    bg-gradient-to-b from-accent-primary to-primary-dark
    flex flex-col items-stretch backdrop-blur-md">

      <nav className="mt-12 space-y-2 px-4">
        {links.map(({ label, href }) => (
          <a
            key={href}
            href={href}
            className={`block rounded-lg px-4 py-2 font-semibold transition
              ${
                active === href
                  ? "bg-primary-light text-accent-dark shadow"
                  : "text-white hover:bg-white/10"
              }`}
          >
            {label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
