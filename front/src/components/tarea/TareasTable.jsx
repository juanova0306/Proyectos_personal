export default function TareasTable({ tareas }) {
  if (!tareas || tareas.length === 0) {
    return (
      <p className="text-gray-500">
        No tienes tareas asignadas
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Título</th>
            <th className="px-4 py-2 text-left">Estado</th>
            <th className="px-4 py-2 text-left">Descripción</th>
            <th className="px-4 py-2 text-left">Prioridad</th>
            <th className="px-4 py-2 text-left">Comentario</th>
          </tr>
        </thead>

        <tbody>
          {tareas.map((t) => (
            <tr
              key={t.tarea_ID}
              className="border-t hover:bg-gray-50"
            >
              <td className="px-4 py-2 font-medium">
                {t.titulo}
              </td>

              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${
                      t.estado === "Completada"
                        ? "bg-green-100 text-green-700"
                        : t.estado === "En Proceso"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                >
                  {t.estado}
                </span>
              </td>

              <td className="px-4 py-2 max-w-xs truncate">
                {t.descripcion}
              </td>

              <td className="px-4 py-2">
                <span
                  className={`font-semibold
                    ${
                      t.prioridad === "Alta"
                        ? "text-red-600"
                        : t.prioridad === "Media"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                >
                  {t.prioridad}
                </span>
              </td>

              <td className="px-4 py-2">
                {t.comentario || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
