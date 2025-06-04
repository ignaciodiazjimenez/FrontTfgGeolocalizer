// src/components/DeviceForm.jsx
import React, { useState, useEffect } from "react";

export default function DeviceForm({
  initialData = { mac: "", nombre: "", active: true, id_usuario: 1 },
  onSubmit,
  onCancel,
  isEditing = false,
}) {
  const [mac, setMac] = useState("");
  const [nombre, setNombre] = useState("");
  const [active, setActive] = useState(true);
  const [error, setError] = useState("");

  // Cargar los datos iniciales (editar) o limpiar (crear)
  useEffect(() => {
    setMac(initialData.mac || "");
    setNombre(initialData.nombre || "");
    setActive(initialData.active === undefined ? true : initialData.active);
    setError("");
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mac.trim() || !nombre.trim()) {
      setError("MAC y Nombre son obligatorios");
      return;
    }
    onSubmit({ mac: mac.trim(), nombre: nombre.trim(), active });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-2xl font-bold mb-4 text-accent-primary">
          {isEditing ? "Editar dispositivo" : "Nuevo dispositivo"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">MAC</label>
            <input
              type="text"
              value={mac}
              onChange={(e) => {
                setMac(e.target.value);
                setError("");
              }}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-accent-primary"
              placeholder="00:11:22:33:44:55"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                setError("");
              }}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-accent-primary"
              placeholder="Dispositivo 1"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="active-checkbox"
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="h-4 w-4 text-accent-primary focus:ring-accent-primary border-gray-300 rounded"
            />
            <label htmlFor="active-checkbox" className="text-sm">
              Activo
            </label>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-accent-primary hover:bg-accent-hover text-black rounded"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
