export default function TareasTable({ tareas }) {
  if (!tareas || tareas.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">No tienes tareas asignadas</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Cuando te asignen tareas, aparecerán aquí para que puedas ver su estado.
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-x-auto bg-white shadow rounded-xl border border-gray-200">
      <table className="w-full text-sm text-left text-gray-700">
        
        {/* ===== HEADER ===== */}
        <thead className="bg-gray-100 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 font-semibold text-gray-700">Título</th>
            <th className="px-6 py-3 font-semibold text-gray-700">Estado</th>
            <th className="px-6 py-3 font-semibold text-gray-700">Descripción</th>
            <th className="px-6 py-3 font-semibold text-gray-700">Prioridad</th>
            <th className="px-6 py-3 font-semibold text-gray-700">Fecha Límite</th>
            <th className="px-6 py-3 font-semibold text-gray-700">Comentario</th>
          </tr>
        </thead>

        {/* ===== BODY ===== */}
        <tbody>
          {tareas.map((tarea) => (
            <tr
              key={tarea.tarea_ID}
              className="odd:bg-white even:bg-gray-50 border-b border-gray-200 hover:bg-gray-100 transition-colors"
            >
              {/* TÍTULO */}
              <td className="px-6 py-4 font-medium text-gray-900">
                {tarea.titulo}
              </td>

              {/* ESTADO */}
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full
                    ${
                      tarea.estado === "Completada"
                        ? "bg-green-100 text-green-700"
                        : tarea.estado === "En Proceso"
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

              {/* DESCRIPCIÓN */}
              <td className="px-6 py-4 text-gray-600 max-w-xs">
                <div className="line-clamp-2">
                  {tarea.descripcion || "Sin descripción"}
                </div>
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
                        : tarea.prioridad === "Baja"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }
                  `}
                >
                  {tarea.prioridad || "Normal"}
                </span>
              </td>

              {/* FECHA LÍMITE */}
              <td className="px-6 py-4 text-gray-600">
                {tarea.fechaLimite ? (
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{new Date(tarea.fechaLimite).toLocaleDateString()}</span>
                  </div>
                ) : (
                  <span className="text-gray-400 italic">Sin fecha</span>
                )}
              </td>

              {/* COMENTARIO */}
              <td className="px-6 py-4 text-gray-600 max-w-xs">
                <div className="line-clamp-2">
                  {tarea.comentario || (
                    <span className="text-gray-400 italic">Sin comentarios</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}