import React, { useState } from "react";
import { login } from "../utils/api";
import FormContainer from "./FormContainer.jsx";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    try {
      // login() ahora envía form-urlencoded y devuelve access_token
      const token = await login(username.trim(), password);

      // Guardamos token en localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }

      // Decodificamos payload del JWT para extraer el rol
      const payload = JSON.parse(atob(token.split(".")[1]));
      const rol = payload.role || payload?.rol || "";

      // Redirigimos según rol
      const destino = rol === "admin" ? "/admin" : "/cliente";
      window.location.href = destino;
    } catch (err) {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <form onSubmit={handleLogin} className="w-full">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-accent-primary drop-shadow-lg">
        <span className="block text-transparent bg-gradient-to-r from-accent-dark to-accent-primary bg-clip-text">
          Geolocalizer
        </span>
      </h1>

      <FormContainer title="Login">
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
          className="w-full mt-6 py-2 bg-accent-primary hover:bg-accent-hover hover:scale-105 transition-all duration-300 text-black font-semibold rounded-full"
        >
          Iniciar Sesión
        </button>

        {error && (
          <p className="mt-4 text-red-600 text-center">{error}</p>
        )}

        <p className="text-center text-sm mt-4 text-gray-800">
          ¿Nuevo aquí?{" "}
          <a href="/registro" className="text-blue-600 hover:underline">
            Regístrate
          </a>
        </p>
      </FormContainer>
    </form>
  );
}
