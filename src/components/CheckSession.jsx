// src/components/CheckSession.jsx
import React, { useEffect } from "react";
import { getToken } from "../utils/api";

export default function CheckSession() {
  useEffect(() => {
    const token = getToken();
    if (token) {
      // Si ya hay token en localStorage, redirigimos a /cliente
      window.location.href = "/cliente";
    }
  }, []);

  return null; // No renderiza nada en el DOM
}
