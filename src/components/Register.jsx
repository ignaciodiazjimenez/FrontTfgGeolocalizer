import React, { useState } from "react";
import { register } from "../utils/api";

export default function Register() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    repeat: "",
    role: "cliente", // valor por defecto
  });

  const [error, setError] = useState("");

  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    setError("");

    if (user.password !== user.repeat) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      // extraer campos necesarios para el backend
      const { username, email, password, role } = user;

      await register({ username, email, password, role });

      alert("Usuario registrado correctamente");
      window.location.href = "/login";
    } catch (err) {
      setError(err.message || "Error al registrar");
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
          <h2 className="text-2xl font-semibold text-center mb-4">Registro</h2>

          <div className="space-y-4">
            <input
              name="username"
              placeholder="Nombre de usuario"
              value={user.username}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/50 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary placeholder-gray-600"
            />
            <input
              name="email"
              type="email"
              placeholder="Correo electrónico"
              value={user.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/50 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary placeholder-gray-600"
            />
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              value={user.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/50 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary placeholder-gray-600"
            />
            <input
              name="repeat"
              type="password"
              placeholder="Repetir contraseña"
              value={user.repeat}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/50 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary placeholder-gray-600"
            />
          </div>

          <button
            onClick={handleRegister}
            className="w-full mt-6 py-2 bg-accent-primary hover:bg-accent-hover hover:scale-105 transition-all duration-500 text-black font-semibold rounded-md"
          >
            REGISTRARME
          </button>

          {error && (
            <p className="text-red-600 text-sm font-medium text-center mt-4">
              {error}
            </p>
          )}

          <p className="text-center text-sm mt-4 text-gray-800">
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Inicia sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
