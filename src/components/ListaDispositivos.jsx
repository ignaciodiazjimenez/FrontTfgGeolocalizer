import React, { useEffect, useState } from "react";
import {
  getDispositivosUsuario,
  deleteDispositivo,
} from "../utils/api";
import CrearDispositivo from "./CrearDispositivo.jsx";

export default function ListaDispositivos() {
  const [dispositivos, setDispositivos] = useState([]);
  const [error, setError] = useState("");

  const fetchDispositivos = async () => {
    try {
      const data = await getDispositivosUsuario();
      setDispositivos(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los dispositivos");
    }
  };

  useEffect(() => {
    fetchDispositivos();
  }, []);

  const handleEliminar = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este dispositivo?")) return;
    try {
      await deleteDispositivo(id);
      fetchDispositivos();
    } catch (err) {
      console.error(err);
      setError("Error al eliminar dispositivo");
    }
  };

  return (
    <div>
      <CrearDispositivo onSuccess={fetchDispositivos} />

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-primary-light">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Tipo Animal</th>
            <th className="px-4 py-2">Fecha Instalación</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {dispositivos.map((d) => (
            <tr key={d.id} className="even:bg-white odd:bg-gray-100">
              <td className="border px-4 py-2">{d.id}</td>
              <td className="border px-4 py-2">{d.tipo_animal}</td>
              <td className="border px-4 py-2">{d.fecha_instalacion}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEliminar(d.id)}
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
