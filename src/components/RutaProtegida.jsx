// src/components/RutaProtegida.jsx
import React, { useEffect, useState } from "react";

export default function RutaProtegida({ allowedRole, redirectTo, children }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // 1. Comprobar existencia de token en localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // 2. Comprobar existencia de rol en localStorage y extraer valor
    //    Nota: aquí asumimos que al hacer login guardaste "rol" con localStorage.setItem("rol", data.role)
    const rol = typeof window !== "undefined" ? localStorage.getItem("rol") : null;

    // 3. Si falta token u rol, o el rol no coincide con allowedRole, redirigimos
    if (!token || !rol || rol !== allowedRole) {
      window.location.href = redirectTo;
    } else {
      // 4. Si token + rol valido, podemos renderizar los hijos
      setReady(true);
    }
  }, [allowedRole, redirectTo]);

  // Hasta que no esté "ready", no mostramos nada
  if (!ready) {
    return null;
  }

  // Si llegamos aquí, token existe, rol existe y coincide con allowedRole
  return <>{children}</>;
}
