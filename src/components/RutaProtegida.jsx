import React, { useEffect, useState } from "react";
import { getToken, getUserRole } from "../utils/api";

export default function RutaProtegida({ allowedRole, redirectTo, children }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getToken();
    const role = getUserRole();

    // Si no hay token o el rol no coincide, redirigimos
    if (!token || role !== allowedRole) {
      window.location.href = redirectTo;
    } else {
      setReady(true);
    }
  }, [allowedRole, redirectTo]);

  // Mientras comprobamos, no renderizamos nada
  if (!ready) {
    return null;
  }

  // Si está todo OK, mostramos los hijos
  return <>{children}</>;
}
