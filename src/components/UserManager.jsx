// src/components/UserManager.jsx
import React, { useState, useEffect } from "react";
import {
  getUsers,
  deleteUser,
  createUser,
  updateUser,
  getUserRole,
} from "../utils/api.js";
import UserForm from "./UserForm.jsx";

export default function UserManager() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // NUEVOS ESTADOS para el buscador
  const [searchField, setSearchField] = useState("username"); // "username" o "id"
  const [searchValue, setSearchValue] = useState("");

  const role = getUserRole(); // "user" | "admin" | "root"

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsuarios(data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      await deleteUser(id);
      fetchUsuarios();
    } catch (err) {
      console.error(err);
      setError("Error al eliminar usuario.");
    }
  };

  const openCreateForm = () => {
    setIsEditing(false);
    // Por defecto, rol “user” (id 3). Root/admin podrá cambiar en el formulario.
    setCurrentUser({ username: "", email: "", rol_id: 3 });
    setShowForm(true);
  };

  const openEditForm = (u) => {
    setIsEditing(true);
    setCurrentUser({
      id: u.id,
      username: u.username,
      email: u.email,
      rol_id: u.rol.id || u.rol_id || 3,
    });
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (isEditing && currentUser) {
        // EDITAR usuario
        const payload = { ...formData };
        await updateUser(currentUser.id, payload);
      } else {
        // CREAR usuario
        await createUser(formData);
      }
      await fetchUsuarios();
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert("Error al guardar en la API.");
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setCurrentUser(null);
  };

  // Lógica de filtrado mejorada:
  // Si searchField === "id", comparamos Number(searchValue) === u.id
  // Si searchField === "username", comparamos u.username.includes(searchValue)
  const filteredUsuarios = usuarios.filter((u) => {
    if (!searchValue.trim()) return true; // Sin filtro si vacío

    if (searchField === "id") {
      // Convertimos a número para comparar con u.id
      const inputId = Number(searchValue);
      if (isNaN(inputId)) return false;
      return u.id === inputId;
    } else {
      // Filtrar por nombre de usuario (insensible a mayúsculas/minúsculas)
      return u.username
        .toLowerCase()
        .includes(searchValue.toLowerCase());
    }
  });

  // Solo root/admin pueden crear usuarios
  const canCreateUser = role === "root" || role === "admin";

  return (
    <div className="flex flex-col items-center w-full px-4 md:px-8 lg:px-16 py-6">
      <div className="w-full max-w-5xl bg-white/20 backdrop-blur-md rounded-xl border border-white/40 shadow-xl p-6 space-y-6">
        {/* Header con buscador por campo y botón Crear */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h2 className="text-3xl font-bold text-[#2F3E2E]">
            Gestión de Usuarios
          </h2>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
            {/* SELECT para elegir campo de búsqueda: ID o Nombre */}
            <select
              value={searchField}
              onChange={(e) => {
                setSearchField(e.target.value);
                setSearchValue("");
              }}
              className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-primary bg-white text-gray-800"
            >
              <option value="username">Buscar por Nombre</option>
              <option value="id">Buscar por ID</option>
            </select>

            {/* INPUT para valor de búsqueda */}
            <input
              type={searchField === "id" ? "number" : "text"}
              placeholder={
                searchField === "id" ? "Escribe ID exacto" : "Escribe nombre"
              }
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-primary text-gray-800 w-full sm:w-64"
            />

            {canCreateUser && (
              <button
                onClick={openCreateForm}
                className="flex items-center space-x-1 bg-accent-primary hover:bg-accent-hover px-4 py-2 rounded-md text-black transition-colors"
              >
                <span className="text-xl">➕</span>
                <span className="font-medium">Crear usuario</span>
              </button>
            )}
          </div>
        </div>

        {/* Contenido principal: tabla de usuarios o mensajes */}
        <div>
          {loading ? (
            <p className="text-center text-gray-700">Cargando usuarios...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : filteredUsuarios.length === 0 ? (
            <p className="text-center text-gray-700">No hay usuarios para mostrar.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-accent-primary/80">
                    <th className="p-3 text-left text-white font-semibold">ID</th>
                    <th className="p-3 text-left text-white font-semibold">Usuario</th>
                    <th className="p-3 text-left text-white font-semibold">Email</th>
                    <th className="p-3 text-left text-white font-semibold">Rol</th>
                    <th className="p-3 text-center text-white font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsuarios.map((u, idx) => {
                    // Si u.rol.id === 1 (root), solo root puede editar/eliminarlo
                    const isTargetRoot = u.rol.id === 1;
                    const isSelfRoot = role === "root";
                    const isSelfAdmin = role === "admin";

                    // Un admin NO puede editar/eliminar al root
                    const canEditThis = isSelfRoot || (isSelfAdmin && !isTargetRoot);
                    const canDeleteThis = isSelfRoot || (isSelfAdmin && !isTargetRoot);

                    return (
                      <tr
                        key={u.id}
                        className={idx % 2 === 0 ? "bg-white/30" : "bg-white/10"}
                      >
                        <td className="p-3 text-gray-900">{u.id}</td>
                        <td className="p-3 text-gray-900">{u.username}</td>
                        <td className="p-3 text-gray-900">{u.email}</td>
                        <td className="p-3 text-gray-900">{u.rol.nombre}</td>
                        <td className="p-3 flex justify-center space-x-4">
                          {canEditThis && (
                            <button
                              onClick={() => openEditForm(u)}
                              title="Editar usuario"
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
                          )}
                          {canDeleteThis && (
                            <button
                              onClick={() => handleEliminar(u.id)}
                              title="Eliminar usuario"
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
                          )}
                          {!canEditThis && !canDeleteThis && (
                            <span className="text-gray-500 italic text-sm">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal para crear/editar usuario */}
        {showForm && (
          <div className="mt-6">
            <UserForm
              initialData={currentUser}
              isEditing={isEditing}
              onSubmit={handleFormSubmit}
              onCancel={handleCancelForm}
            />
          </div>
        )}
      </div>
    </div>
  );
}
