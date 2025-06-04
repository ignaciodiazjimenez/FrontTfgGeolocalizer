import React, { useState, useEffect } from "react";
import {
  getDispositivos,
  deleteDispositivo,
  createDispositivo,
  updateDispositivo,
} from "../utils/api.js";
import DeviceForm from "./DeviceForm.jsx";

export default function DeviceManager() {
  const [dispositivos, setDispositivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDevice, setCurrentDevice] = useState(null);

  useEffect(() => {
    fetchDispositivos();
  }, []);

  const fetchDispositivos = async () => {
    setLoading(true);
    try {
      const data = await getDispositivos();
      setDispositivos(data);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar la lista de dispositivos.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este dispositivo?")) return;
    try {
      await deleteDispositivo(id);
      setDispositivos((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error al borrar el dispositivo.");
    }
  };

  const openCreateForm = () => {
    setIsEditing(false);
    setCurrentDevice({ mac: "", nombre: "", active: true });
    setShowForm(true);
  };

  const openEditForm = (device) => {
    setIsEditing(true);
    setCurrentDevice(device);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (isEditing && currentDevice) {
        // EDITAR
        await updateDispositivo(currentDevice.id, formData);
      } else {
        // CREAR
        const usuario_id = parseInt(localStorage.getItem("user_id")); // <- Aquí añadimos el usuario
        if (!usuario_id) {
          alert("No se pudo obtener el ID del usuario.");
          return;
        }

        await createDispositivo({
          ...formData,
          usuario_id,
        });
      }
      await fetchDispositivos();
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert("Error al guardar en la API.");
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setCurrentDevice(null);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-accent-primary">Gestión de Dispositivos</h1>
        <button
          onClick={openCreateForm}
          className="flex items-center space-x-1 px-4 py-2 bg-accent-primary hover:bg-accent-hover rounded text-black"
        >
          <span className="text-xl">➕</span>
          <span>Añadir dispositivo</span>
        </button>
      </div>

      {loading ? (
        <p>Cargando dispositivos...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : dispositivos.length === 0 ? (
        <p>No hay dispositivos para mostrar.</p>
      ) : (
        <div className="border border-blue-500 rounded-lg overflow-hidden">
          <div className="grid grid-cols-4 bg-blue-500 text-white font-semibold text-center py-2">
            <div>MAC</div>
            <div>Nombre</div>
            <div>Activo</div>
            <div>Acciones</div>
          </div>

          {dispositivos.map((device) => (
            <div
              key={device.id}
              className="grid grid-cols-4 text-center items-center border-b last:border-b-0"
            >
              <div className="py-2">{device.mac}</div>
              <div className="py-2">{device.nombre}</div>
              <div className="py-2">{device.active ? "Sí" : "No"}</div>
              <div className="flex justify-center space-x-2 py-2">
                <button
                  onClick={() => openEditForm(device)}
                  title="Editar"
                  className="hover:text-yellow-400 text-yellow-600"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(device.id)}
                  title="Eliminar"
                  className="hover:text-red-400 text-red-600"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <DeviceForm
          initialData={currentDevice}
          isEditing={isEditing}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  );
}
