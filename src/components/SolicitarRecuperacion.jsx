import React, { useState } from "react";
// import { solicitarRecuperacion } from "../utils/api"; // ← lo conectamos cuando tengas el backend

export default function SolicitarRecuperacion() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (!email.trim()) {
      setError("Introduce tu correo electrónico");
      return;
    }

    try {
      // Aquí se llamará al backend real
      // await solicitarRecuperacion(email);

      setEnviado(true); // simulamos éxito
    } catch (err) {
      setError(err.message || "Error al enviar el correo");
    }
  };

  return (
    <div className="w-96 mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-accent-primary drop-shadow-lg">
        <span className="block text-transparent bg-gradient-to-r from-[#2F3E2E] to-[#A9D18E] bg-clip-text">
          Recuperar contraseña
        </span>
      </h1>

      <div className="relative">
        <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 hover:blur-md bg-accent-primary transition-all duration-500 animate-glow border border-accent-primary z-0" />
        <div className="absolute inset-0 rounded-xl border-2 border-accent-primary opacity-50 animate-pulse-sonar z-0" />

        <div className="relative bg-white/30 backdrop-blur-md rounded-xl p-8 text-gray-900 border border-white/50 shadow-xl z-10 transition-all duration-500 space-y-4">
          {enviado ? (
            <p className="text-center text-green-700 font-medium">
              Si el correo existe, recibirás un enlace para restablecer tu contraseña.
            </p>
          ) : (
            <>
              <input
                type="email"
                placeholder="Tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-white/50 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary placeholder-gray-600"
              />
              <button
                onClick={handleSubmit}
                className="w-full mt-4 py-2 bg-accent-primary hover:bg-accent-hover hover:scale-105 transition-all duration-500 text-black font-semibold rounded-md"
              >
                Enviar enlace
              </button>
              {error && (
                <p className="text-red-600 text-sm font-medium text-center">
                  {error}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
