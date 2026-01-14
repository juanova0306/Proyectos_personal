import { useEffect, useState } from "react";
import { obtenerTareas } from "../../service/tareasService";
import { obtenerUsuarios } from "../../service/UsuarioService";
import GraficaEstadoTareas from "../Graficas/GraficaEstadoTareas";
import { Calendar, Users, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function HomeJefe() {
  const [usuarios, setUsuarios] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [usuariosData, tareasData] = await Promise.all([
        obtenerUsuarios(),
        obtenerTareas(),
      ]);
      setUsuarios(usuariosData || []);
      setTareas(tareasData || []);
    } catch (err) {
      setError("Error al cargar la información");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Estadísticas (MISMA lógica que tenías)
  const totalTareas = tareas.length;
  const tareasCompletadas = tareas.filter(t => t.estado === "Completada").length;
  const tareasPendientes = tareas.filter(t => t.estado === "Pendiente").length;
  const tareasEnProceso = tareas.filter(t => t.estado === "En Progreso").length;
  const porcentajeCompletadas =
    totalTareas > 0 ? ((tareasCompletadas / totalTareas) * 100).toFixed(1) : 0;

  // 🔹 Fecha
  const obtenerFechaActual = () => {
    return new Date().toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 🔹 Tareas recientes (igual que antes)
  const tareasRecientes = [...tareas]
    .sort((a, b) => new Date(b.fechaCreacion || 0) - new Date(a.fechaCreacion || 0))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 p-6">{error}</p>;
  }

  return (
    <div className="space-y-6 p-4 md:p-6">

      {/* 🔹 ENCABEZADO */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <p className="text-gray-600"> Aquí tienes un resumen de las actividades y el progreso de tu equipo. <span className="block text-sm text-gray-500 mt-1">
              <Calendar className="inline-block w-4 h-4 mr-1" /> {obtenerFechaActual()} </span>
            </p>
          </div>

          <div className="mt-4 md:mt-0 bg-white p-4 rounded-lg shadow-sm flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Equipo activo</p>
              <p className="text-xl font-bold">{usuarios.length} miembros</p>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 ESTADÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total de tareas" value={totalTareas} icon={CheckCircle} />
        <StatCard title="Completadas" value={tareasCompletadas} icon={CheckCircle} />
        <StatCard title="En proceso" value={tareasEnProceso} icon={Clock} />
        <StatCard title="Pendientes" value={tareasPendientes} icon={AlertCircle} />
      </div>

      {/* 🔹 GRÁFICA (altura corregida) */}
      <div className="grid grid-cols-1">
        <div className="h-[420px]">
          <GraficaEstadoTareas tareas={tareas} />
        </div>
      </div>

      {/* 🔹 TAREAS + RESUMEN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

        {/* TAREAS RECIENTES */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm h-full">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold text-lg">Tareas recientes</h3>
            <span className="text-sm text-blue-600">{tareasRecientes.length} tareas</span>
          </div>

          <div className="space-y-3">
            {tareasRecientes.length > 0 ? tareasRecientes.map((tarea, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
              >
                <div>
                  <p className="font-medium">{tarea.titulo || "Sin título"}</p>
                  <p className="text-xs text-gray-500">
                    Asignado a: {tarea.asignadoA || "No asignado"}
                  </p>
                </div>

                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full
                    ${tarea.estado === "Completada" && "bg-green-100 text-green-700"}
                    ${tarea.estado === "EnProceso" && "bg-blue-100 text-blue-700"}
                    ${tarea.estado === "Pendiente" && "bg-yellow-100 text-yellow-700"}
                  `}>
                    {tarea.estado}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {tarea.fechaCreacion
                      ? new Date(tarea.fechaCreacion).toLocaleDateString()
                      : "Sin fecha"}
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-center py-6">
                No hay tareas recientes
              </p>
            )}
          </div>
        </div>

        {/* Resumen del equipo */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col">
          <h3 className="font-semibold text-lg text-gray-800 mb-4">
            Resumen del equipo
          </h3>

          <div className="space-y-4 flex-1">
            {/* Miembros activos */}
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-800">Miembros activos</p>
                  <p className="text-sm text-gray-600">
                    {usuarios.length} personas
                  </p>
                </div>
              </div>
            </div>

            {/* Productividad */}
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-800">Productividad</p>
                  <p className="text-sm text-gray-600">
                    {porcentajeCompletadas}% de eficiencia
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Botón abajo fijo */}
          <div className="pt-4 border-t border-gray-100">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Generar reporte completo
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

/* 🔹 Card reutilizable */
function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm min-h-[120px] flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <Icon className="w-6 h-6 text-blue-600" />
    </div>
  );
}
