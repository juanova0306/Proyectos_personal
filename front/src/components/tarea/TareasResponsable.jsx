import { useState, useEffect } from "react";
import EditarTareaModal from "../../components/tarea/EditarTarea.jsx";
import EliminarTareaModal from "../../components/tarea/EliminarTarea.jsx";

export default function TareasResponsableTable({ tareas: tareasProp, usuarioLogueadoId }) {
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modales usando la lógica del Jefe
  const [selectedTarea, setSelectedTarea] = useState(null);
  const [tareaToDelete, setTareaToDelete] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  /* =============================
     CARGA DE TAREAS
  ============================== */
  useEffect(() => {
    console.log("📋 Tareas recibidas del backend:", tareasProp);
    console.log("👤 Usuario logueado ID:", usuarioLogueadoId);

    if (Array.isArray(tareasProp)) {
      setTareas(tareasProp);
    } else {
      setTareas([]);
    }

    setLoading(false);
  }, [tareasProp, usuarioLogueadoId]);

  /* =============================
     MANEJO DE MODALES
  ============================== */

  // Abrir modal de edición
  const abrirModalEditar = (tarea) => {
    setSelectedTarea(tarea);
    setIsEditOpen(true);
  };

  // Cerrar modal de edición
  const cerrarModalEditar = () => {
    setIsEditOpen(false);
    setSelectedTarea(null);
  };

  // Abrir modal de eliminación
  const abrirModalEliminar = (tarea) => {
    setTareaToDelete(tarea);
    setIsDeleteOpen(true);
  };

  // Cerrar modal de eliminación
  const cerrarModalEliminar = () => {
    setIsDeleteOpen(false);
    setTareaToDelete(null);
  };

  /* =============================
     HANDLERS DE ACCIONES
  ============================== */

  // Cuando se actualiza una tarea
  const handleTareaUpdated = (tareaActualizada) => {
    setTareas(prev =>
      prev.map(t =>
        t.tarea_ID === tareaActualizada.tarea_ID
          ? { ...t, ...tareaActualizada }
          : t
      )
    );
    cerrarModalEditar();
  };

  // Cuando se elimina una tarea
  const handleTareaDeleted = (tareaId) => {
    setTareas(prev => prev.filter(t => t.tarea_ID !== tareaId));
    cerrarModalEliminar();
  };

  /* =============================
     RENDER
  ============================== */
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Cargando tareas...</p>
      </div>
    );
  }

  if (!tareas.length) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No tienes tareas asignadas</p>
        <p className="text-sm text-gray-400 mt-2">
          (Usuario ID: {usuarioLogueadoId})
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ===== TABLA ===== */}
      <div className="relative overflow-x-auto bg-white shadow rounded-xl border border-gray-200">
        <table className="w-full text-sm text-left text-gray-700">
          
          {/* ===== HEADER ===== */}
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 font-semibold">ID</th>
              <th className="px-6 py-3 font-semibold">Título</th>
              <th className="px-6 py-3 font-semibold">Descripción</th>
              <th className="px-6 py-3 font-semibold">Responsable</th>
              <th className="px-6 py-3 font-semibold">Rol</th>
              <th className="px-6 py-3 font-semibold">Estado</th>
              <th className="px-6 py-3 font-semibold text-center">Acciones</th>
            </tr>
          </thead>

          {/* ===== BODY ===== */}
          <tbody>
            {tareas.map((tarea) => (
              <tr
                key={tarea.tarea_ID}
                className="odd:bg-white even:bg-gray-50 border-b border-gray-200 hover:bg-gray-100 transition"
              >
                {/* ID */}
                <td className="px-6 py-4 font-medium text-gray-900">
                  #{tarea.tarea_ID}
                </td>

                {/* TÍTULO */}
                <td className="px-6 py-4 font-medium">
                  {tarea.titulo}
                </td>

                {/* DESCRIPCIÓN */}
                <td className="px-6 py-4 text-gray-600">
                  {tarea.descripcion ? (
                    tarea.descripcion.length > 50 ? 
                    `${tarea.descripcion.substring(0, 50)}...` : 
                    tarea.descripcion
                  ) : "Sin descripción"}
                </td>

                {/* RESPONSABLE */}
                <td className="px-6 py-4">
                  {tarea.responsable || "Sin responsable"}
                </td>

                {/* ROL */}
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                    {tarea.rol || "Sin rol"}
                  </span>
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
                          : tarea.estado === "Pendiente"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-gray-200 text-gray-700"
                      }
                    `}
                  >
                    {tarea.estado}
                  </span>
                </td>

                {/* ACCIONES */}
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => abrirModalEditar(tarea)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => abrirModalEliminar(tarea)}
                      className="text-red-600 hover:text-red-800 font-medium hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== MODAL EDITAR ===== */}
      <EditarTareaModal
        isOpen={isEditOpen}
        tarea={selectedTarea}
        onClose={cerrarModalEditar}
        onSuccess={handleTareaUpdated}
      />

      {/* ===== MODAL ELIMINAR ===== */}
      <EliminarTareaModal
        isOpen={isDeleteOpen}
        tarea={tareaToDelete}
        onClose={cerrarModalEliminar}
        usuarioId={usuarioLogueadoId}
        onSuccess={handleTareaDeleted}
      />
    </>
  );
}