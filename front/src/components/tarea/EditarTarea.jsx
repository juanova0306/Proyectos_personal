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

  useEffect(() => {
    if (tarea && isOpen) {
      setForm({
        Tarea_ID: tarea.tarea_ID,
        Estado: tarea.estado,
        Prioridad: tarea.prioridad
      });
    }
  }, [tarea, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await actualizarTarea(form.Tarea_ID, {
        Estado: form.Estado,
        Prioridad: form.Prioridad
      });

      // 🔥 DEVOLVEMOS LA TAREA ACTUALIZADA
      onSuccess({
        tarea_ID: form.Tarea_ID,
        estado: form.Estado,
        prioridad: form.Prioridad
      });
    } catch (err) {
      alert("Error al actualizar tarea");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4">Editar Tarea</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <p>Estado</p>
          <select
            name="Estado"
            value={form.Estado}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Seleccione estado</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En Progreso">En Progreso</option>
            <option value="Completada">Completada</option>
          </select>
          <p>Prioridad</p>
          <select
            name="Prioridad"
            value={form.Prioridad}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Seleccione prioridad</option>
            <option value="Baja">Baja</option>
            <option value="Media">Media</option>
            <option value="Alta">Alta</option>
          </select>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
