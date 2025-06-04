// src/components/Register.jsx
import React, { useState } from "react";
import { register } from "../utils/api";
import FormContainer from "./FormContainer.jsx";

export default function Register() {
  /* ---------------- state ---------------- */
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    repeat: "",
  });
  const [error, setError] = useState("");

  /* ------------- handlers --------------- */
  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    /* validaciones mínimas */
    if (!form.username.trim() || !form.email.trim() || !form.password || !form.repeat) {
      setError("Rellena todos los campos");
      return;
    }
    if (form.password !== form.repeat) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      /* payload EXACTO que necesita tu backend */
      const payload = {
        username: form.username.trim(),
        email:    form.email.trim(),
        password: form.password,
        rol_id:   3,                     // 3 = “user/cliente”
      };

      await register(payload);          // → POST /usuarios

      alert("Usuario registrado correctamente");
      window.location.href = "/login";
    } catch (err) {
      setError(err.message || "Error al registrar");
    }
  };

  /* -------------- UI -------------------- */
  return (
    <form onSubmit={handleRegister} className="w-full">
      {/* título principal */}
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-accent-primary drop-shadow-lg">
        <span className="block text-transparent bg-gradient-to-r from-accent-dark to-accent-primary bg-clip-text">
          Geolocalizer
        </span>
      </h1>

      {/* tarjeta con brillo */}
      <FormContainer title="Registro">
        <div className="space-y-4">
          <input
            name="username"
            placeholder="Nombre de usuario"
            value={form.username}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white/50 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary placeholder-gray-600"
          />
          <input
            name="email"
            type="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white/50 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary placeholder-gray-600"
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white/50 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary placeholder-gray-600"
          />
          <input
            name="repeat"
            type="password"
            placeholder="Repetir contraseña"
            value={form.repeat}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white/50 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary placeholder-gray-600"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-6 py-2 bg-accent-primary hover:bg-accent-hover hover:scale-105 transition-all duration-300 text-black font-semibold rounded-full"
        >
          REGISTRARME
        </button>

        {error && (
          <p className="mt-4 text-red-600 text-center">{error}</p>
        )}

        <p className="text-center text-sm mt-4 text-gray-800">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Inicia sesión
          </a>
        </p>
      </FormContainer>
    </form>
  );
}
