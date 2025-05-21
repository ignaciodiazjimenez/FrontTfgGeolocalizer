import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../utils/api";

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");

  // Cargar usuarios al montar
  useEffect(() => {
    fetchUsuarios();
  }, []);

  async function fetchUsuarios() {
    try {
      const data = await getUsers();
      setUsuarios(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los usuarios");
    }
  }

  async function handleEliminar(id) {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      await deleteUser(id);
      // Refrescar lista
      fetchUsuarios();
    } catch (err) {
      console.error(err);
      setError("Error al eliminar usuario");
    }
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Usuarios registrados</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-primary-light">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Usuario</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Rol</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id} className="even:bg-white odd:bg-gray-100">
              <td className="border px-4 py-2">{u.id}</td>
              <td className="border px-4 py-2">{u.username}</td>
              <td className="border px-4 py-2">{u.email}</td>
              <td className="border px-4 py-2">{u.role}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEliminar(u.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
