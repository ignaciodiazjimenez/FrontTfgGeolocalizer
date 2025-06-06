// src/components/RutaProtegida.jsx
import React, { useEffect, useState } from "react";

/**
 * Ahora allowedRole puede ser:
 *  - Una cadena, p.ej. "user"
 *  - Un array de cadenas, p.ej. ["user", "admin"]
 */
export default function RutaProtegida({ allowedRole, redirectTo, children }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // 1. Recuperamos token y rol del localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const rol   = typeof window !== "undefined" ? localStorage.getItem("rol")   : null;

    // 2. Si falta token u rol, redirigimos inmediatamente
    if (!token || !rol) {
      window.location.href = redirectTo;
      return;
    }

    // 3. Comprobar si rol es uno de los permitidos
    //    Si allowedRole viene como cadena, lo convertimos a array para simplificar
    const rolesPermitidos = Array.isArray(allowedRole) ? allowedRole : [allowedRole];

    if (!rolesPermitidos.includes(rol)) {
      // Si el rol no está en la lista permitida => redirigir
      window.location.href = redirectTo;
      return;
    }

    // 4. Si llegamos aquí, el rol está permitido
    setReady(true);
  }, [allowedRole, redirectTo]);

  // Hasta que no pase la validación (ready = true), no renderizamos children
  if (!ready) {
    return null;
  }

  return <>{children}</>;
}
