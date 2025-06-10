import React, { useState, useEffect } from "react";
import {
  getDispositivosUsuario,
  deleteDispositivo,
  createDispositivo,
  updateDispositivo,
} from "../utils/api.js";
import DeviceForm from "./DeviceForm.jsx";
import ConfirmModal from "./ConfirmModal.jsx";

export default function DeviceManager() {
  // ------------------ Estados principales ------------------
  const [dispositivos, setDispositivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal de creación / edición
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDevice, setCurrentDevice] = useState(null);

  // Búsqueda
  const [searchName, setSearchName] = useState("");
  const [searchMac, setSearchMac] = useState("");

  // Modal de confirmación de borrado
  const [showConfirm, setShowConfirm] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ------------------ Carga de dispositivos ------------------
  const fetchDispositivos = async () => {
    setLoading(true);
    try {
      const usuarioId = localStorage.getItem("user_id");
      if (!usuarioId) throw new Error("Usuario no autenticado");
      const data = await getDispositivosUsuario(usuarioId);
      setDispositivos(data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar la lista de dispositivos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDispositivos();
  }, []);

  // ------------------ Crear / Editar ------------------
  const openCreateForm = () => {
    setIsEditing(false);
    setCurrentDevice({ mac: "", nombre: "", active: true });
    setShowForm(true);
  };

  const openEditForm = (device) => {
    setIsEditing(true);
    setCurrentDevice({ ...device });
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (isEditing && currentDevice) {
        await updateDispositivo(currentDevice.id, {
          mac: formData.mac,
          nombre: formData.nombre,
          active: formData.active,
        });
      } else {
        await createDispositivo({
          mac: formData.mac,
          nombre: formData.nombre,
          active: formData.active,
        });
      }
      await fetchDispositivos();
      setShowForm(false);
      setCurrentDevice(null);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleCancelForm = async () => {
    setShowForm(false);
    setCurrentDevice(null);
    await fetchDispositivos();
  };

  // ------------------ Borrado con confirmación ------------------
  const openDeleteConfirm = (device) => {
    setDeviceToDelete(device);
    setShowConfirm(true);
  };

  const closeDeleteConfirm = () => {
    setShowConfirm(false);
    setDeviceToDelete(null);
  };

  const confirmDelete = async () => {
    if (!deviceToDelete) return;
    setDeleting(true);
    try {
      await deleteDispositivo(deviceToDelete.id);
      setDispositivos((prev) =>
        prev.filter((d) => d.id !== deviceToDelete.id)
      );
    } catch (err) {
      console.error(err);
      alert("Error al borrar el dispositivo."); // podrías cambiarlo por un toast
    } finally {
      setDeleting(false);
      closeDeleteConfirm();
    }
  };

  // ------------------ Filtrado ------------------
  const filteredDispositivos = dispositivos.filter((device) => {
    const matchesName = device.nombre
      .toLowerCase()
      .includes(searchName.toLowerCase());
    const matchesMac = device.mac.toLowerCase().includes(searchMac.toLowerCase());
    return matchesName && matchesMac;
  });

  // ------------------ Render ------------------
  return (
    <div className="flex flex-col items-center w-full px-4 md:px-8 lg:px-16 py-6">
      <div className="w-full max-w-5xl bg-white/20 backdrop-blur-md rounded-xl border border-white/40 shadow-xl p-6 space-y-6">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h2 className="text-3xl font-bold text-[#2F3E2E]">
            Gestión de Dispositivos
          </h2>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <input
              type="text"
              placeholder="Buscar por nombre"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-primary text-gray-800 w-full sm:w-48"
            />
            <input
              type="text"
              placeholder="Buscar por MAC"
              value={searchMac}
              onChange={(e) => setSearchMac(e.target.value)}
              className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-primary text-gray-800 w-full sm:w-48"
            />
            <button
              type="button"
              onClick={openCreateForm}
              className="flex items-center space-x-1 bg-accent-primary hover:bg-accent-hover px-4 py-2 rounded-md text-black transition-colors"
            >
              <span className="text-xl">➕</span>
              <span className="font-medium">Añadir dispositivo</span>
            </button>
          </div>
        </div>

        {/* Contenido principal */}
        <div>
          {loading ? (
            <p className="text-center text-gray-700">Cargando dispositivos...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : filteredDispositivos.length === 0 ? (
            <p className="text-center text-gray-700">
              No hay dispositivos para mostrar.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-accent-primary/80">
                    <th className="p-3 text-left text-white font-semibold">
                      MAC
                    </th>
                    <th className="p-3 text-left text-white font-semibold">
                      Nombre
                    </th>
                    <th className="p-3 text-left text-white font-semibold">
                      Funcionando
                    </th>
                    <th className="p-3 text-center text-white font-semibold">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDispositivos.map((device, idx) => (
                    <tr
                      key={device.id}
                      className={idx % 2 === 0 ? "bg-white/30" : "bg-white/10"}
                    >
                      <td className="p-3 text-gray-900">{device.mac}</td>
                      <td className="p-3 text-gray-900">{device.nombre}</td>
                      <td className="p-3 text-gray-900">
                        {device.active ? (
                          <span className="inline-block px-2 py-0.5 bg-green-200 text-green-800 text-sm rounded-full">
                            Sí
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 bg-red-200 text-red-800 text-sm rounded-full">
                            No
                          </span>
                        )}
                      </td>
                      <td className="p-3 flex justify-center space-x-4">
                        {/* Editar */}
                        <button
                          type="button"
                          onClick={() => openEditForm(device)}
                          title="Editar dispositivo"
                          className="text-black hover:text-gray-700 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.536a2.5 2.5 0 113.536 3.536L7 21H3v-4L16.732 3.732z"
                            />
                          </svg>
                        </button>

                        {/* Eliminar */}
                        <button
                          type="button"
                          onClick={() => openDeleteConfirm(device)}
                          title="Eliminar dispositivo"
                          className="text-red-600 hover:text-red-400 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V4a1 1 0 011-1h6a1 1 0 011 1v3"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal de creación / edición */}
        {showForm && (
          <div className="mt-6">
            <DeviceForm
              initialData={currentDevice}
              isEditing={isEditing}
              onSubmit={handleFormSubmit}
              onCancel={handleCancelForm}
            />
          </div>
        )}

        {/* Modal de confirmación de borrado */}
        {showConfirm && (
          <ConfirmModal
            title="Eliminar dispositivo"
            message={`¿Seguro que quieres eliminar “${deviceToDelete?.nombre}”?`}
            onCancel={closeDeleteConfirm}
            onConfirm={confirmDelete}
            loading={deleting}
          />
        )}
      </div>
    </div>
  );
}
