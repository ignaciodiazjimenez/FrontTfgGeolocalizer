import React, { useState, useEffect } from "react";
// import { resetPassword } from "../utils/api"; // ← la conectamos luego

export default function ResetPassword() {
  const [token, setToken] = useState(null);
  const [passwords, setPasswords] = useState({ nueva: "", repetir: "" });
  const [error, setError] = useState("");
  const [cambiada, setCambiada] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (!t) setError("Token inválido");
    else setToken(t);
  }, []);

  const handleChange = (e) =>
    setPasswords({ ...passwords, [e.target.name]: e.target.value });

  const handleCambiar = async () => {
    setError("");

    if (passwords.nueva !== passwords.repetir) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      // Aquí se conecta con el backend real
      // await resetPassword(token, passwords.nueva);

      setCambiada(true); // simula éxito
    } catch (err) {
      setError(err.message || "Error al cambiar la contraseña");
    }
  };

  return (
    <div className="w-96 mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-accent-primary drop-shadow-lg">
        <span className="block text-transparent bg-gradient-to-r from-[#2F3E2E] to-[#A9D18E] bg-clip-text">
          Nueva contraseña
        </span>
      </h1>

      <div className="relative">
        <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 hover:blur-md bg-accent-primary transition-all duration-500 animate-glow border border-accent-primary z-0" />
        <div className="absolute inset-0 rounded-xl border-2 border-accent-primary opacity-50 animate-pulse-sonar z-0" />

        <div className="relative bg-white/30 backdrop-blur-md rounded-xl p-8 text-gray-900 border border-white/50 shadow-xl z-10 transition-all duration-500 space-y-4">
          {cambiada ? (
            <p className="text-center text-green-700 font-medium">
              Contraseña cambiada con éxito. Puedes{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                iniciar sesión.
              </a>
            </p>
          ) : error ? (
            <p className="text-red-600 text-sm font-medium text-center">
              {error}
            </p>
          ) : (
            <>
              <input
                type="password"
                name="nueva"
                placeholder="Nueva contraseña"
                value={passwords.nueva}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/50 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary placeholder-gray-600"
              />
              <input
                type="password"
                name="repetir"
                placeholder="Repetir contraseña"
                value={passwords.repetir}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/50 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary placeholder-gray-600"
              />
              <button
                onClick={handleCambiar}
                className="w-full mt-4 py-2 bg-accent-primary hover:bg-accent-hover hover:scale-105 transition-all duration-500 text-black font-semibold rounded-md"
              >
                Cambiar contraseña
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
