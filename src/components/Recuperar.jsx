import React, { useState } from "react";
import { recoverPassword } from "../utils/api";


export default function Recuperar() {
  const [step, setStep] = useState(1);
  const [datos, setDatos] = useState({
    username: "",
    email: "",
    nueva: "",
    repetir: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setDatos({ ...datos, [e.target.name]: e.target.value });

  const handleVerificar = () => {
    setError("");
    if (!datos.username || !datos.email) {
      setError("Completa usuario y correo");
      return;
    }

    // Aquí llamarías a la API real para verificar identidad
    setStep(2); // simulado
  };

  const handleCambiar = async () => {
    setError("");
  
    if (datos.nueva !== datos.repetir) {
      setError("Las contraseñas no coinciden");
      return;
    }
  
    try {
      // Llamada real al backend
      await recoverPassword({
        username: datos.username,
        email: datos.email,
        nuevaPassword: datos.nueva,
      });
  
      alert("Contraseña actualizada con éxito");
      window.location.href = "/login";
    } catch (err) {
      setError(err.message || "Error al cambiar la contraseña");
    }
  };
  

  return (
    <div className="w-96 mx-auto">
      {/* Título */}
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-accent-primary drop-shadow-lg">
        <span className="block text-transparent bg-gradient-to-r from-[#2F3E2E] to-[#A9D18E] bg-clip-text">
          Recuperar contraseña
        </span>
      </h1>

      {/* Glow + Sonar + Formulario */}
      <div className="relative">
        <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 hover:blur-md bg-accent-primary transition-all duration-500 animate-glow border border-accent-primary z-0" />
        <div className="absolute inset-0 rounded-xl border-2 border-accent-primary opacity-50 animate-pulse-sonar z-0" />

        <div className="relative bg-white/30 backdrop-blur-md rounded-xl p-8 text-gray-900 border border-white/50 shadow-xl z-10 transition-all duration-500 space-y-4">
          {step === 1 ? (
            <>
              <input
                name="username"
                placeholder="Nombre de usuario"
                value={datos.username}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/50 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary placeholder-gray-600"
              />
              <input
                name="email"
                type="email"
                placeholder="Correo electrónico"
                value={datos.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/50 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary placeholder-gray-600"
              />
              <button
                onClick={handleVerificar}
                className="w-full mt-4 py-2 bg-accent-primary hover:bg-accent-hover hover:scale-105 transition-all duration-500 text-black font-semibold rounded-md"
              >
                Verificar
              </button>
            </>
          ) : (
            <>
              <input
                name="nueva"
                type="password"
                placeholder="Nueva contraseña"
                value={datos.nueva}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/50 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary placeholder-gray-600"
              />
              <input
                name="repetir"
                type="password"
                placeholder="Repetir contraseña"
                value={datos.repetir}
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

          {error && (
            <p className="mt-4 text-red-600 text-sm font-medium text-center">
              {error}
            </p>
          )}

          {/* Enlace al login visible siempre */}
          <p className="text-center text-sm mt-6 text-gray-800">
            ¿Ya recuerdas tu contraseña?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Inicia sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
