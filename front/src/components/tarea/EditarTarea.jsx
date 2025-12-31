import { useEffect, useState } from "react";
import { actualizarTarea } from "../../service/tareasService";

export default function EditarTareaModal({
  isOpen,
  onClose,
  tarea,
  onSuccess
}) {

  const [form, setForm] = useState({
    Tarea_ID: "",
    Estado: "",
    Prioridad: ""
  });

  /* ===== Cargar datos al abrir modal ===== */
  useEffect(() => {
    if (tarea && isOpen) {
      setForm({
        Tarea_ID: tarea.tarea_ID,   //  ESTE ERA EL BUG
        Estado: tarea.estado,
        Prioridad: tarea.prioridad
      });

    }
  }, [tarea, isOpen]);

  /* ===== Handle change ===== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /* ===== Submit ===== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await actualizarTarea(form.Tarea_ID, {
        Estado: form.Estado,
        Prioridad: form.Prioridad
      });

      onSuccess(); // refresca tabla
      onClose();   // cierra modal
    } catch (error) {
      alert(
        error.response?.data?.mensaje ||
        "Error al actualizar la tarea"
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl w-full max-w-md p-6">

        {/* ===== HEADER ===== */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Editar Tarea
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✖
          </button>
        </div>

        {/* ===== FORM ===== */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ESTADO */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Estado
            </label>
            <select
              name="Estado"
              value={form.Estado}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-indigo-200"
              required
            >
              <option value="">Seleccione estado</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En Progreso">En Progreso</option>
              <option value="Completada">Completada</option>
            </select>
          </div>

          {/* PRIORIDAD */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Prioridad
            </label>
            <select
              name="Prioridad"
              value={form.Prioridad}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-indigo-200"
              required
            >
              <option value="">Seleccione prioridad</option>
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
            </select>
          </div>

          {/* ===== FOOTER ===== */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Guardar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
