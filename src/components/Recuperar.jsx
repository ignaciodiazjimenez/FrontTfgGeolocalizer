import React, { useState } from "react";
import { recoverPassword } from "../utils/api"; // Asumiendo que agregas un endpoint para verificación

export default function Recuperar() {
  const [step, setStep] = useState(1);
  const [datos, setDatos] = useState({
    username: "",
    email: "",
    nueva: "",
    repetir: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setDatos({ ...datos, [e.target.name]: e.target.value });

  // Paso 1: Verificar que el usuario y el correo existen
  const handleVerificar = async (e) => {
    e.preventDefault();
    setError("");

    const { username, email } = datos;
    if (!username.trim() || !email.trim()) {
      setError("Completa usuario y correo");
      return;
    }

    try {
      setLoading(true);
      // Llamada real al backend para verificar identidad
      // Por ejemplo: await verifyUserEmail(username, email);
      await verifyUserEmail({ username, email });
      setStep(2);
    } catch (err) {
      // Si la API devuelve un error (por ejemplo, usuario o email no coinciden)
      setError(err.response?.data?.message || "Error al verificar datos");
    } finally {
      setLoading(false);
    }
  };

  // Paso 2: Cambiar la contraseña
  const handleCambiar = async (e) => {
    e.preventDefault();
    setError("");

    const { nueva, repetir, username, email } = datos;
    if (!nueva || !repetir) {
      setError("Ambos campos de contraseña son obligatorios");
      return;
    }

    if (nueva !== repetir) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      setLoading(true);
      // Llamada real al backend para actualizar contraseña
      await recoverPassword({
        username,
        email,
        nuevaPassword: nueva,
      });

      alert("Contraseña actualizada con éxito");
      window.location.href = "/login";
    } catch (err) {
      setError(err.response?.data?.message || "Error al cambiar la contraseña");
    } finally {
      setLoading(false);
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
            // FORMULARIO DE VERIFICACIÓN
            <form onSubmit={handleVerificar} className="space-y-4">
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
                type="submit"
                disabled={loading}
                className={`w-full mt-4 py-2 bg-accent-primary hover:bg-accent-hover hover:scale-105 transition-all duration-500 text-black font-semibold rounded-md ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Verificando..." : "Verificar"}
              </button>
            </form>
          ) : (
            // FORMULARIO PARA CAMBIAR CONTRASEÑA
            <form onSubmit={handleCambiar} className="space-y-4">
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
                type="submit"
                disabled={loading}
                className={`w-full mt-4 py-2 bg-accent-primary hover:bg-accent-hover hover:scale-105 transition-all duration-500 text-black font-semibold rounded-md ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Cambiando..." : "Cambiar contraseña"}
              </button>
            </form>
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
