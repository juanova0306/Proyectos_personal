import { useEffect, useState } from "react";
import { obtenerTareas } from "../../service/tareasService";
import { obtenerUsuarios } from "../../service/UsuarioService";
import GraficaEstadoTareas from "../Graficas/GraficaEstadoTareas";
import { Calendar, Users, CheckCircle, Clock, AlertCircle, FileText, Target, BarChart, Eye } from "lucide-react";

export default function HomeResponsable() {
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Estadísticas del equipo
  const totalTareas = tareas.length;
  const tareasCompletadas = tareas.filter(t => t.estado === "Completada").length;
  const tareasPendientes = tareas.filter(t => t.estado === "Pendiente").length;
  const tareasEnProceso = tareas.filter(t => t.estado === "En Progreso").length;
  const porcentajeCompletadas = totalTareas > 0 ? ((tareasCompletadas / totalTareas) * 100).toFixed(1) : 0;

  // 🔹 Usuarios a cargo
  const usuariosACargo = usuarios.filter(u => u.rolId === 3);

  // 🔹 Tareas recientes
  const tareasRecientes = [...tareas]
    .sort((a, b) => new Date(b.fechaCreacion || 0) - new Date(a.fechaCreacion || 0))
    .slice(0, 5);

  const obtenerFechaActual = () => {
    return new Date().toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={cargarDatos}
            className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* 🔹 ENCABEZADO */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Responsable</h1>
            <p className="text-gray-600">
              Seguimiento y gestión del equipo
            </p>
            <span className="inline-flex items-center mt-2 text-sm text-gray-500">
              <Calendar className="inline-block w-4 h-4 mr-2" />
              {obtenerFechaActual()}
            </span>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center gap-4">
            <div className="text-center">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-1" />
              <p className="text-sm text-gray-500">Equipo</p>
              <p className="text-xl font-bold">{usuariosACargo.length}</p>
            </div>
            
          </div>
        </div>
      </div>

      {/* 🔹 ESTADÍSTICAS PRINCIPALES */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <BarChart className="w-5 h-5 mr-2 text-blue-600" />
            Estadísticas Generales
          </h2>
          <span className="text-sm text-gray-500">{totalTareas} tareas en total</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total de tareas" 
            value={totalTareas} 
            icon={FileText}
            color="blue"
            percentage={`${porcentajeCompletadas}% completadas`}
          />
          <StatCard 
            title="Completadas" 
            value={tareasCompletadas} 
            icon={CheckCircle}
            color="green"
            subtitle="Finalizadas satisfactoriamente"
          />
          <StatCard 
            title="En proceso" 
            value={tareasEnProceso} 
            icon={Clock}
            color="yellow"
            subtitle="En desarrollo"
          />
          <StatCard 
            title="Pendientes" 
            value={tareasPendientes} 
            icon={AlertCircle}
            color="red"
            subtitle="Por asignar o iniciar"
          />
        </div>
      </div>

      {/* 🔹 GRÁFICA Y EQUIPO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GRÁFICA */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border h-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg flex items-center">
              <BarChart className="w-5 h-5 mr-2 text-blue-600" />
              Distribución de Tareas del Equipo
            </h3>
            <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              Ver detalles
            </button>
          </div>
          <div className="h-[350px]">
            <GraficaEstadoTareas tareas={tareas} />
          </div>
        </div>

        {/* RESUMEN DEL EQUIPO */}
        <div className="bg-white rounded-xl shadow-sm border p-6 h-full flex flex-col">
          <h3 className="font-semibold text-lg text-gray-800 mb-6 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Mi Equipo 
          </h3>

          <div className="space-y-4 flex-1">
            {usuariosACargo.length > 0 ? (
              usuariosACargo.slice(0, 5).map((usuario, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold mr-3">
                      {usuario.nombre?.charAt(0)}{usuario.apellido?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {usuario.nombre} {usuario.apellido}
                      </p>
                      <p className="text-sm text-gray-500 truncate max-w-[150px]">
                        {usuario.email}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No tienes equipo asignado</p>
                <p className="text-sm text-gray-400 mt-1">Contacta al administrador</p>
              </div>
            )}
          </div>

          {/* Acciones rápidas */}
          <div className="pt-6 mt-6 border-t border-gray-100 space-y-3">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
              <Users className="w-4 h-4 mr-2" />
              Gestionar equipo
            </button>
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
              <BarChart className="w-4 h-4 mr-2" />
              Reporte semanal
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 TAREAS RECIENTES */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-lg flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            Últimas Tareas Registradas
          </h3>
          <span className="text-sm text-gray-500">Últimas 5 tareas</span>
        </div>

        <div className="space-y-3">
          {tareasRecientes.length > 0 ? tareasRecientes.map((tarea, i) => (
            <div
              key={i}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center mb-1">
                  <p className="font-medium text-gray-800 truncate">{tarea.titulo || "Sin título"}</p>
                  {tarea.prioridad === "Alta" && (
                    <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                      Alta prioridad
                    </span>
                  )}
                </div>
                
              </div>

              <div className="flex items-center space-x-3">
                <span className={`text-xs px-3 py-1 rounded-full whitespace-nowrap
                  ${tarea.estado === "Completada" && "bg-green-100 text-green-700"}
                  ${tarea.estado === "En Progreso" && "bg-blue-100 text-blue-700"}
                  ${tarea.estado === "Pendiente" && "bg-yellow-100 text-yellow-700"}
                `}>
                  {tarea.estado}
                </span>
                <button className="text-blue-600 hover:text-blue-800">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          )) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No hay tareas registradas</p>
              <p className="text-sm text-gray-400 mt-1">Comienza creando la primera tarea</p>
            </div>
          )}
        </div>

        {tareas.length > 5 && (
          <div className="mt-6 text-center">
            <button className="text-blue-600 hover:text-blue-800 font-medium py-2 px-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
              Ver todas las tareas ({tareas.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* 🔹 Card reutilizable */
function StatCard({ title, value, icon: Icon, color, percentage, subtitle }) {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    yellow: "text-yellow-600 bg-yellow-50",
    red: "text-red-600 bg-red-50",
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${colorClasses[color] || colorClasses.blue}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {percentage && (
        <p className="text-xs font-medium text-gray-600">{percentage}</p>
      )}
      {subtitle && (
        <p className="text-xs text-gray-500">{subtitle}</p>
      )}
    </div>
  );
}