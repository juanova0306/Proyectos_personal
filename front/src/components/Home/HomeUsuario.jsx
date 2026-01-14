import { useState, useEffect } from "react";
import { obtenerTareas } from "../../service/tareasService";
import { Calendar, CheckCircle, Clock, AlertCircle, Target, FileText, TrendingUp, Bell, CheckSquare } from "lucide-react";

export default function HomeUsuario() {
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usuarioId, setUsuarioId] = useState(null);

  useEffect(() => {
    const usuarioId = localStorage.getItem("usuario_ID");
    setUsuarioId(usuarioId);
    cargarTareasUsuario(usuarioId);
  }, []);

  const cargarTareasUsuario = async (id) => {
    try {
      setLoading(true);
      const todasLasTareas = await obtenerTareas();
      
      // Filtrar tareas del usuario actual
      const tareasUsuario = todasLasTareas.filter(tarea => 
        tarea.asignadoA == id || 
        tarea.responsable_ID == id
      );
      
      setTareas(tareasUsuario || []);
    } catch (err) {
      console.error("Error al cargar tareas:", err);
      setError("No se pudieron cargar tus tareas");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Estadísticas
  const tareasCompletadas = tareas.filter(t => t.estado === "Completada").length;
  const tareasEnProgreso = tareas.filter(t => t.estado === "Inicial").length;
  const tareasPendientes = tareas.filter(t => t.estado === "Pendiente").length;
  const tareasUrgentes = tareas.filter(t => t.prioridad === "Alta" && t.estado !== "Completada").length;
  const porcentajeCompletitud = tareas.length > 0 
    ? Math.round((tareasCompletadas / tareas.length) * 100) 
    : 0;

  // 🔹 Tareas recientes (últimas 3)
  const tareasRecientes = [...tareas]
    .sort((a, b) => new Date(b.fechaCreacion || 0) - new Date(a.fechaCreacion || 0))
    .slice(0, 3);

  // 🔹 Obtener fecha actual
  const obtenerFechaActual = () => {
    return new Date().toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 🔹 Obtener saludo
  const obtenerSaludo = () => {
    const hora = new Date().getHours();
    if (hora < 12) return "¡Buenos días!";
    if (hora < 19) return "¡Buenas tardes!";
    return "¡Buenas noches!";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tu dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center">
          <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
          <div>
            <p className="text-red-700">{error}</p>
            <button 
              onClick={() => cargarTareasUsuario(usuarioId)}
              className="mt-2 text-sm text-red-600 hover:text-red-800"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* 🔹 ENCABEZADO SIMPLE */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            
            <h1 className="text-2xl font-bold text-gray-800">
              {obtenerSaludo()}
            </h1>
            <div className="flex items-center mt-2 text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{obtenerFechaActual()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 ESTADÍSTICAS COMPACTAS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-xl font-bold">{tareas.length}</p>
            </div>
            <FileText className="w-5 h-5 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completadas</p>
              <p className="text-xl font-bold">{tareasCompletadas}</p>
            </div>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Inicial</p>
              <p className="text-xl font-bold">{tareasEnProgreso}</p>
            </div>
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Urgentes</p>
              <p className="text-xl font-bold">{tareasUrgentes}</p>
            </div>
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
        </div>
      </div>

      {/* 🔹 PROGRESO COMPACTO */}
      <div className="bg-white rounded-xl shadow-sm border p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="font-semibold text-gray-800">Tu progreso</h3>
          </div>
          <span className="text-sm text-gray-500">{porcentajeCompletitud}% completado</span>
        </div>

        <div className="mb-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full" 
              style={{ width: `${porcentajeCompletitud}%` }}
            ></div>
          </div>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <div className="text-center">
            <div className="font-bold text-green-600">{tareasCompletadas}</div>
            <div className="text-xs">Completadas</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-yellow-600">{tareasEnProgreso}</div>
            <div className="text-xs">En progreso</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-gray-600">{tareasPendientes}</div>
            <div className="text-xs">Pendientes</div>
          </div>
        </div>
      </div>

      {/* 🔹 TAREAS RECIENTES - DISEÑO COMPACTO */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="px-5 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-gray-800">Tareas recientes</h3>
            </div>
            <span className="text-sm text-gray-500">{tareas.length} totales</span>
          </div>
        </div>

        <div className="p-5">
          {tareasRecientes.length > 0 ? (
            <div className="space-y-3">
              {tareasRecientes.map((tarea, index) => (
                <div key={tarea.tarea_ID || index} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-800 truncate">{tarea.titulo}</p>
                      <span className={`ml-2 text-xs px-2 py-1 rounded-full whitespace-nowrap
                        ${tarea.estado === "Completada" ? "bg-green-100 text-green-700" :
                          tarea.estado === "En Progreso" ? "bg-blue-100 text-blue-700" :
                          "bg-gray-100 text-gray-700"}
                      `}>
                        {tarea.estado}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="truncate mr-3">{tarea.descripcion?.substring(0, 50) || "Sin descripción"}</span>
                      {tarea.prioridad === "Alta" && (
                        <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded">Alta</span>
                      )}
                    </div>
                  </div>
                  <button className="ml-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Ver
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No tienes tareas asignadas</p>
              <p className="text-sm text-gray-400 mt-1">Tu responsable te asignará tareas pronto</p>
            </div>
          )}
        </div>
      </div>

      {/* 🔹 ACCIONES RÁPIDAS */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="font-semibold text-gray-800">¿Qué quieres hacer?</h3>
            <p className="text-sm text-gray-600 mt-1">Acciones rápidas para tu día</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
              Ver todas mis tareas
            </button>
            <button className="px-4 py-2 bg-white text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 text-sm font-medium">
              Marcar completadas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}