import React, { useState, useEffect } from "react";

export default function DeviceForm({
  initialData = { mac: "", nombre: "", active: true },
  onSubmit,
  onCancel,
  isEditing = false,
}) {
  const [mac, setMac] = useState("");
  const [nombre, setNombre] = useState("");
  const [active, setActive] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Cargamos datos iniciales cuando cambie initialData
  useEffect(() => {
    setMac(initialData.mac || "");
    setNombre(initialData.nombre || "");
    setActive(
      typeof initialData.active === "boolean" ? initialData.active : true
    );
    setError("");
    setSubmitting(false);
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!mac.trim() || !nombre.trim()) {
      setError("MAC y Nombre son obligatorios");
      return;
    }

    setSubmitting(true);
    try {
      // onSubmit debe rechazar si la API falla
      await onSubmit({
        mac: mac.trim(),
        nombre: nombre.trim(),
        active,
      });
      // El padre cierra el modal al resolver
    } catch (err) {
      console.error(err);
      // Ignorar errores de CORS/Network que realmente crearon el recurso
      if (err instanceof TypeError && err.message.includes("Failed to fetch")) {
        onCancel();
      } else {
        setError("Error al guardar en la API");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-2xl font-bold mb-4 text-accent-primary">
          {isEditing ? "Editar dispositivo" : "Añadir dispositivo"}
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
              disabled={submitting}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-accent-primary text-black"
              placeholder="00:1A:2B:3C:4D:5E"
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
              disabled={submitting}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-accent-primary text-black"
              placeholder="Nombre del dispositivo"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="active-checkbox"
              checked={active}
              onChange={(e) => {
                setActive(e.target.checked);
                setError("");
              }}
              disabled={submitting}
              className="h-4 w-4 text-accent-primary border-gray-300 rounded focus:ring-accent-primary"
            />
            <label htmlFor="active-checkbox" className="text-sm font-medium">
              Activo
            </label>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-accent-primary hover:bg-accent-hover text-black rounded disabled:opacity-50"
            >
              {submitting
                ? isEditing
                  ? "Guardando..."
                  : "Creando..."
                : isEditing
                ? "Guardar cambios"
                : "Crear dispositivo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
