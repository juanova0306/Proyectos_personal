import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#eab308","#10b981", "#ef4444", "#6366f1"];

export default function GraficaEstadoTareas({ tareas }) {
  const conteo = {};

  tareas.forEach(t => {
    conteo[t.estado || "Sin estado"] =
      (conteo[t.estado || "Sin estado"] || 0) + 1;
  });

  const data = Object.entries(conteo).map(([estado, value], i) => ({
    name: estado,
    value,
    color: COLORS[i % COLORS.length],
  }));

  if (tareas.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm h-full flex items-center justify-center">
        <p className="text-gray-500">No hay tareas para mostrar</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm h-full">
      <h3 className="font-semibold text-lg mb-4">Estado de las tareas</h3>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={140}
              innerRadius={70}
              label
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
