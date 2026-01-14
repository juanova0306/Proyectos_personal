import { useEffect, useState } from "react";
import { eliminarTarea } from "../../service/tareasService";

export default function EliminarTareaModal({
  isOpen,
  onClose,
  tarea,
  usuarioId,
  onSuccess
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* =============================
     Reset al abrir
  ============================== */
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen || !tarea) return null;

  /* =============================
     Confirmar eliminación
  ============================== */
  const handleEliminar = async () => {
    try {
      setLoading(true);
      await eliminarTarea(tarea.tarea_ID, usuarioId);
      onSuccess(tarea.tarea_ID);
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.mensaje ||
        err.message ||
        "Error al eliminar la tarea"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl w-full max-w-md p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Eliminar Tarea
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✖
          </button>
        </div>

        {/* BODY */}
        <p className="text-sm text-gray-600 mb-4">
          ¿Estás seguro de que deseas eliminar la tarea
          <span className="font-semibold"> "{tarea.titulo}"</span>?
          <br />
          Esta acción no se puede deshacer.
        </p>

        {/* ERROR */}
        {error && (
          <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded-lg">
            {error}
          </div>
        )}

        {/* FOOTER */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            onClick={handleEliminar}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>

      </div>
    </div>
  );
}
