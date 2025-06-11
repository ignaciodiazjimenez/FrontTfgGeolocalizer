// src/components/UserForm.jsx
import React, { useState, useEffect } from "react";
import { getRoles, getUserRole } from "../utils/api";

export default function UserForm({
  initialData = { username: "", email: "", rol_id: 3 },
  onSubmit,
  onCancel,
  isEditing = false,
}) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rolId, setRolId] = useState(3);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");

  // Sacamos rol del usuario autenticado
  const currentRole = getUserRole(); // "root" | "admin" | "user"

  // Cargamos roles y datos iniciales
  useEffect(() => {
    async function fetchRoles() {
      try {
        const data = await getRoles();
        setRoles(data || []);
      } catch (err) {
        console.error(err);
      }
    }
    fetchRoles();

    setUsername(initialData.username || "");
    setEmail(initialData.email || "");
    setRolId(initialData.rol_id || 3);
    setPassword("");
    setError("");
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || (!isEditing && !password.trim())) {
      setError("Username, email y password (si es nuevo) son obligatorios");
      return;
    }
    const payload = { username: username.trim(), email: email.trim(), rol_id: Number(rolId) };
    if (!isEditing || (isEditing && password.trim())) {
      payload.password = password.trim();
    }
    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-2xl font-bold mb-4 text-accent-primary">
          {isEditing ? "Editar usuario" : "Crear nuevo usuario"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-accent-primary"
              placeholder="Usuario"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-accent-primary"
              placeholder="usuario@ejemplo.com"
            />
          </div>

          {!isEditing && (
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-accent-primary"
                placeholder="********"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Rol</label>
            <select
              value={rolId}
              onChange={(e) => setRolId(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-accent-primary"
            >
              {roles.map((r) => {
                // Si el usuario autenticado es “admin”, no permitimos elegir rol “root” (id=1)
                if (currentRole === "admin" && r.id === 1) {
                  return null;
                }
                return (
                  <option key={r.id} value={r.id}>
                    {r.nombre}
                  </option>
                );
              })}
            </select>
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
              {isEditing ? "Guardar cambios" : "Crear usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
