import React from "react";

export default function Footer() {
  return (
    <footer className="w-full text-center text-sm text-white bg-[#2F3E2E] py-4 px-6 backdrop-blur-md border-t border-white/10 shadow-inner mt-auto">
      Página creada por{' '}
      <a
        href="https://www.linkedin.com/in/ignacio-de-loyola-d%C3%ADaz-jim%C3%A9nez"
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent-primary font-medium hover:underline"
      >
        Ignacio de Loyola Díaz Jiménez
      </a>{' '}y{' '}
      <a
        href="https://www.linkedin.com/in/alejandro-moral-bermejo/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent-primary font-medium hover:underline"
      >
        Alejandro Moral Bermejo
      </a>{' '}© 2025
    </footer>
  );
}
