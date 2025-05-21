import React, { useState } from "react";
import { createDispositivo } from "../utils/api";

export default function CrearDispositivo({ onSuccess }) {
  const [tipo, setTipo] = useState("");
  const [fecha, setFecha] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tipo || !fecha) {
      setError("Completa todos los campos");
      return;
    }
    try {
      await createDispositivo({ tipo_animal: tipo, fecha_instalacion: fecha });
      setTipo("");
      setFecha("");
      setError("");
      onSuccess(); // refresca la lista
    } catch (err) {
      console.error(err);
      setError("Error al crear dispositivo");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4">
      <h3 className="text-lg font-medium">Añadir nuevo dispositivo</h3>
      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="Tipo de animal"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="flex-1 px-3 py-2 border rounded"
        />
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="px-3 py-2 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-accent-primary hover:bg-accent-hover rounded"
        >
          Crear
        </button>
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </form>
  );
}
