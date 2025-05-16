import React, { useState } from "react";
import { login } from "../utils/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    try {
      const token = await login(username, password);
      console.log("TOKEN RECIBIDO:", token);
      localStorage.setItem("token", token);

      // Extraer y mostrar payload para depurar
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("PAYLOAD DECODIFICADO:", payload);
      const rol = payload.role;

      alert(`Bienvenido ${username} (rol: ${rol})`);

      let destino = "/";
      if (rol === "admin") destino = "/admin";
      else if (rol === "cliente") destino = "/cliente";

      console.log("Redirigiendo a:", destino);
      window.location.href = destino;
    } catch (err) {
      console.error("Error de login:", err);
      setError("Credenciales incorrectas o servidor no responde");
    }
  };

  return (
    <div className="w-96 mx-auto">
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
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-white/50 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary placeholder-gray-600"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            onClick={handleLogin}
            className="w-full mt-4 py-2 bg-accent-primary hover:bg-accent-hover hover:scale-105 transition-all duration-500 text-black font-semibold rounded-md"
          >
            LOGIN
          </button>

          {error && (
            <p className="mt-4 text-red-600 text-sm text-center font-medium">{error}</p>
          )}

          <p className="text-center text-sm mt-4 text-gray-800">
            ¿Nuevo aquí?{" "}
            <a href="/registro" className="text-blue-600 hover:underline">
              Regístrate
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
