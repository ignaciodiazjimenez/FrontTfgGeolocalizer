import React from "react";

export default function ConfirmModal({
  title = "Eliminar dispositivo",
  message = "¿Seguro que quieres eliminar este dispositivo?",
  onConfirm,
  onCancel,
  loading = false,
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-2xl font-bold mb-4 text-accent-primary">{title}</h2>
        <p className="text-gray-800 dark:text-gray-100 mb-6">{message}</p>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded disabled:opacity-50"
          >
            {loading ? "Eliminando…" : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
