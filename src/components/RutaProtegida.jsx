import React, { useEffect, useState } from "react";
import { getToken, getUserRole } from "../utils/api";

export default function RutaProtegida({ children, soloRol }) {
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
    const token = getToken();
    const rol = getUserRole();

    if (!token) {
      window.location.href = "/login";
    } else if (soloRol && rol !== soloRol) {
      window.location.href = "/";
    } else {
      setAutorizado(true);
    }
  }, [soloRol]);

  if (!autorizado) return null;

  return <>{children}</>;
}
