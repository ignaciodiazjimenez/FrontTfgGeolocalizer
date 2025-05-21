import React, { useState } from "react";
import { login } from "../utils/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("🟢 handleLogin ejecutado");

    if (!username.trim() || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    try {
      // login() ahora envía form-urlencoded y devuelve el access_token
      const token = await login(username.trim(), password);
      console.log("🔐 TOKEN:", token);

      // Guardamos token en localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }

      // Decodificamos payload del JWT para extraer el rol
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("📦 PAYLOAD:", payload);
      const rol = payload.role || payload?.rol || "";

      // Dependiendo del rol redirigimos
      const destino = rol === "admin" ? "/admin" : "/cliente";
      console.log("➡️ Redirigiendo a:", destino);
      window.location.href = destino;

    } catch (err) {
      console.error("❌ Login error:", err);
      setError("Credenciales incorrectas");
    }
  };

  return (
    <form onSubmit={handleLogin} className="w-96 mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-accent-primary drop-shadow-lg">
        <span className="block text-transparent bg-gradient-to-r from-[#2F3E2E] to-[#A9D18E] bg-clip-text">
          Geolocalizer
        </span>
      </h1>

      <div className="relative">
        <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 hover:blur-md bg-accent-primary transition-all duration-500 animate-glow border border-accent-primary z-0" />
        <div className="absolute inset-0 rounded-xl border-2 border-accent-primary opacity-50 animate-pulse-sonar z-0" />

        <div className="relative bg-white/30 backdrop-blur-md rounded-xl p-8 text-gray-900 border border-white/50 shadow-xl z-10 transition-all duration-500">
          <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(""); }}
              className="w-full px-4 py-2 bg-white/50 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary placeholder-gray-600"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              className="w-full px-4 py-2 bg-white/50 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary placeholder-gray-600"
            />
          </div>

          <div className="flex items-center justify-between mt-4 text-sm text-gray-800">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="accent-accent-primary" />
              <span>Recordarme</span>
            </label>
            <a href="/recuperar" className="text-blue-600 hover:underline">
              ¿Olvidaste la contraseña?
            </a>
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-2 bg-accent-primary hover:bg-accent-hover hover:scale-105 transition-all duration-500 text-black font-semibold rounded-md"
          >
            Iniciar Sesión
          </button>

          {error && (
            <p className="mt-4 text-red-600 text-sm text-center font-medium">
              {error}
            </p>
          )}

          <p className="text-center text-sm mt-4 text-gray-800">
            ¿Nuevo aquí?{" "}
            <a href="/registro" className="text-blue-600 hover:underline">
              Regístrate
            </a>
          </p>
        </div>
      </div>
    </form>
  );
}
