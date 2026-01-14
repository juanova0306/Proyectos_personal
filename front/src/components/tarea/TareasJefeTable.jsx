import { useState } from "react";
import EditarTareaModal from "./EditarTarea.jsx";
import EliminarTareaModal from "./EliminarTarea.jsx";

export default function TareasJefeTable({
  tareas,
  onTareaUpdated,
  onTareaDeleted
}) {
  const [selectedTarea, setSelectedTarea] = useState(null);
  const [tareaToDelete, setTareaToDelete] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <div className="relative overflow-x-auto bg-white shadow rounded-xl border border-gray-200">
        <table className="w-full text-sm text-left text-gray-700">
          
          {/* ===== HEADER ===== */}
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 font-semibold">ID</th>
              <th className="px-6 py-3 font-semibold">Título</th>
              <th className="px-6 py-3 font-semibold">Estado</th>
              <th className="px-6 py-3 font-semibold">Prioridad</th>
              <th className="px-6 py-3 font-semibold text-center">
                Acciones
              </th>
            </tr>
          </thead>

          {/* ===== BODY ===== */}
          <tbody>
            {tareas.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-6 text-center text-gray-500"
                >
                  No hay tareas registradas
                </td>
              </tr>
            ) : (
              tareas.map((tarea) => (
                <tr
                  key={tarea.tarea_ID}
                  className="odd:bg-white even:bg-gray-50 border-b border-gray-200 hover:bg-gray-100 transition"
                >
                  {/* ID */}
                  <td className="px-6 py-4 font-medium text-gray-900">
                    #{tarea.tarea_ID}
                  </td>

                  {/* TÍTULO */}
                  <td className="px-6 py-4">
                    {tarea.titulo}
                  </td>

                  {/* ESTADO */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full
                        ${
                          tarea.estado === "Completada"
                            ? "bg-green-100 text-green-700"
                            : tarea.estado === "En Progreso"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-200 text-gray-700"
                        }
                      `}
                    >
                      {tarea.estado}
                    </span>
                  </td>

                  {/* PRIORIDAD */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full
                        ${
                          tarea.prioridad === "Alta"
                            ? "bg-red-100 text-red-700"
                            : tarea.prioridad === "Media"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-blue-100 text-blue-700"
                        }
                      `}
                    >
                      {tarea.prioridad}
                    </span>
                  </td>

                  {/* ACCIONES */}
                  <td className="px-6 py-4 flex justify-center gap-3">
                    <button
                      onClick={() => {
                        setSelectedTarea(tarea);
                        setIsEditOpen(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => {
                        setTareaToDelete(tarea);
                        setIsDeleteOpen(true);
                      }}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ===== MODAL EDITAR ===== */}
      <EditarTareaModal
        isOpen={isEditOpen}
        tarea={selectedTarea}
        onClose={() => setIsEditOpen(false)}
        onSuccess={(tareaActualizada) => {
          onTareaUpdated(tareaActualizada);
          setIsEditOpen(false);
        }}
      />

      {/* ===== MODAL ELIMINAR ===== */}
      <EliminarTareaModal
        isOpen={isDeleteOpen}
        tarea={tareaToDelete}
        onClose={() => setIsDeleteOpen(false)}
        onSuccess={(tareaId) => {
          onTareaDeleted(tareaId);
          setIsDeleteOpen(false);
        }}
      />
    </>
  );
}
