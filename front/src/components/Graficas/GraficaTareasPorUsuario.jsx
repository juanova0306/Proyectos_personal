import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

export default function GraficaTareasPorUsuario({ tareas, usuarios }) {

  // Usuarios operativos
  const usuariosRol3 = usuarios.filter(u => u.rolId === 3);

  const data = usuariosRol3.map(usuario => {
    const nombreCompleto = `${usuario.nombre} ${usuario.apellido}`;

    const totalTareas = tareas.filter(
      t => t.responsable === nombreCompleto
    ).length;

    return {
      usuario: nombreCompleto,
      tareas: totalTareas
    };
  });

  return (
    <div className="bg-white rounded-xl shadow p-6 h-96">
      <h3 className="font-semibold mb-4">
        Tareas por usuario (Rol operativo)
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <XAxis type="number" />
          <YAxis dataKey="usuario" type="category" width={180} />
          <Tooltip />
          <Bar dataKey="tareas">
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.tareas === 0 ? "#d1d5db" : "#3b82f6"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
