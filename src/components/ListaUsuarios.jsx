import React, { useState, useEffect } from "react";
import { getUsers, deleteUser } from "../utils/api";

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevo, setNuevo] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "cliente",
  });

  useEffect(() => {
    getUsers()
      .then(setUsuarios)
      .catch(() => alert("Error al cargar usuarios"));
  }, []);

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar este usuario?")) return;

    try {
      await deleteUser(id);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert("Error al eliminar usuario");
    }
  };

  const handleChange = (e) => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  const handleCrear = async (e) => {
    e.preventDefault();

    // 🔜 Aquí se conectará con register() en el siguiente paso
    alert("Simulación: usuario creado");
    setMostrarFormulario(false);
    setNuevo({ nombre: "", email: "", password: "", rol: "cliente" });

    // Opcional: refrescar la lista desde backend
    // const actualizados = await getUsers();
    // setUsuarios(actualizados);
  };

  return (
    <div className="bg-white/10 rounded-xl p-6 shadow-lg overflow-x-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Usuarios registrados</h2>
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-accent-primary hover:bg-accent-hover px-4 py-2 rounded-md text-black font-semibold transition"
        >
          {mostrarFormulario ? "Cancelar" : "Crear usuario"}
        </button>
      </div>

      {mostrarFormulario && (
        <form
          onSubmit={handleCrear}
          className="bg-white/5 border border-white/20 rounded-xl p-4 space-y-4 text-white"
        >
          <div className="grid grid-cols-2 gap-4">
            <input
              name="nombre"
              placeholder="Nombre"
              value={nuevo.nombre}
              onChange={handleChange}
              className="px-3 py-2 rounded bg-white/30 focus:outline-none placeholder-white/60"
              required
            />
            <input
              name="email"
              placeholder="Email"
              value={nuevo.email}
              onChange={handleChange}
              className="px-3 py-2 rounded bg-white/30 focus:outline-none placeholder-white/60"
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              value={nuevo.password}
              onChange={handleChange}
              className="px-3 py-2 rounded bg-white/30 focus:outline-none placeholder-white/60"
              required
            />
            <select
              name="rol"
              value={nuevo.rol}
              onChange={handleChange}
              className="px-3 py-2 rounded bg-white/30 focus:outline-none"
            >
              <option value="cliente">Cliente</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-400 text-white font-semibold px-4 py-2 rounded transition"
            >
              Crear
            </button>
          </div>
        </form>
      )}

      <table className="w-full text-sm text-white/90">
        <thead>
          <tr className="text-left border-b border-white/20">
            <th className="py-2">Nombre</th>
            <th className="py-2">Email</th>
            <th className="py-2">Rol</th>
            <th className="py-2 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id} className="hover:bg-white/5 transition">
              <td className="py-2">{u.nombre}</td>
              <td className="py-2">{u.email}</td>
              <td className="py-2">{u.rol}</td>
              <td className="py-2 text-right">
                <button
                  onClick={() => handleEliminar(u.id)}
                  className="text-red-400 hover:text-red-300 font-medium text-sm"
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
