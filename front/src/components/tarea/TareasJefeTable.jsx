import { useState, useEffect } from "react";
import { obtenerUsuarios } from "../../service/UsuarioService.js";
import { obtenerRoles } from "../../service/RolService";
import EditarTareaModal from "../../components/tarea/EditarTarea.jsx";

export default function TareasJefeTable({ tareas }) {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTarea, setSelectedTarea] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Cargar usuarios y roles
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [usuariosData, rolesData] = await Promise.all([
          obtenerUsuarios(),
          obtenerRoles()
        ]);
        
        setUsuarios(Array.isArray(usuariosData) ? usuariosData : []);
        setRoles(Array.isArray(rolesData) ? rolesData : []);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  // Función para obtener nombre completo del usuario
  const obtenerNombreUsuario = (usuarioId) => {
    if (!usuarioId || usuarios.length === 0) return 'No asignado';
    
    const usuario = usuarios.find(u => 
      u.usuario_ID === usuarioId || 
      u.id === usuarioId ||
      u.ID === usuarioId ||
      u.usuarioId === usuarioId
    );
    
    if (!usuario) return 'Usuario no encontrado';
    
    return `${usuario.nombre || usuario.Nombre || ''} ${usuario.apellido || usuario.Apellido || ''}`.trim();
  };

  // Función para obtener el rol del usuario asignado
  const obtenerRolUsuario = (usuarioId) => {
    if (!usuarioId || usuarios.length === 0) return 'Sin rol';
    
    const usuario = usuarios.find(u => 
      u.usuario_ID === usuarioId || 
      u.id === usuarioId ||
      u.ID === usuarioId ||
      u.usuarioId === usuarioId
    );
    
    if (!usuario) return 'Sin rol';
    
    // Obtener el ID del rol del usuario
    const rolId = usuario.rol_ID || usuario.rolID || usuario.rol_id || usuario.rolId;
    
    // Buscar el nombre del rol
    const rol = roles.find(r => 
      r.rol_ID === rolId || 
      r.id === rolId ||
      r.ID === rolId ||
      r.rolId === rolId
    );
    
    return rol?.nombre || rol?.Nombre || 'Sin rol';
  };

  // Obtener avatar del usuario
  const obtenerAvatarUsuario = (usuarioId) => {
    const usuario = usuarios.find(u => 
      u.usuario_ID === usuarioId || 
      u.id === usuarioId ||
      u.ID === usuarioId ||
      u.usuarioId === usuarioId
    );
    
    if (!usuario) return '?';
    
    const nombre = usuario.nombre || usuario.Nombre || '';
    return nombre.charAt(0).toUpperCase();
  };

  // Función para abrir el modal de edición de tarea
  const handleEditTarea = (tarea) => {
    if (tarea) {
      setSelectedTarea(tarea);
      setIsEditModalOpen(true);
    }
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedTarea(null);
  };

  // Función para cuando se actualiza una tarea exitosamente
  const handleTareaUpdated = () => {
    // Puedes recargar los datos o mostrar un mensaje
    console.log("Tarea actualizada exitosamente");
    // Si necesitas recargar las tareas:
    // window.location.reload(); // O llamar a una función de recarga
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando datos...</p>
      </div>
    );
  }

  if (!tareas || tareas.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-gray-600">No hay tareas registradas</p>
      </div>
    );
  }

  const getPriorityColor = (prioridad) => {
    switch (prioridad?.toLowerCase()) {
      case 'alta': return 'bg-red-100 text-red-800 border border-red-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'baja': return 'bg-green-100 text-green-800 border border-green-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'completada': return 'bg-green-100 text-green-800';
      case 'en progreso': 
      case 'en_progreso':
      case 'enprogreso': return 'bg-blue-100 text-blue-800';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'atrasada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progreso) => {
    if (progreso >= 80) return 'bg-green-500';
    if (progreso >= 50) return 'bg-yellow-500';
    if (progreso >= 20) return 'bg-blue-500';
    return 'bg-red-500';
  };

  const getRolColor = (rolNombre) => {
    const rol = rolNombre?.toLowerCase();
    switch (rol) {
      case 'jefe':
      case 'administrador':
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'supervisor': return 'bg-indigo-100 text-indigo-800';
      case 'empleado':
      case 'colaborador': return 'bg-blue-100 text-blue-800';
      case 'técnico': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Título
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Asignado a
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Rol
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Progreso
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Prioridad
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tareas.map((t) => {
                const usuarioId = t.usuario_ID || t.usuarioID || t.usuario_id || t.usuarioAsignado;
                const nombreUsuario = obtenerNombreUsuario(usuarioId);
                const rolUsuario = obtenerRolUsuario(usuarioId);
                const avatar = obtenerAvatarUsuario(usuarioId);
                
                return (
                  <tr key={t.tarea_ID || t.id} className="hover:bg-gray-50 transition-colors">
                    {/* Título */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-indigo-50 rounded-lg flex items-center justify-center mr-3">
                          <svg className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{t.titulo || 'Sin título'}</div>
                          {t.descripcion && (
                            <div className="text-xs text-gray-500 truncate max-w-xs">
                              {t.descripcion}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Asignado a */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-gray-600">
                            {avatar}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {nombreUsuario}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {usuarioId || 'No asignado'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Rol */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRolColor(rolUsuario)}`}>
                        {rolUsuario}
                      </span>
                    </td>

                    {/* Estado de la tarea */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(t.estado)}`}>
                        {t.estado || 'Sin estado'}
                      </span>
                    </td>

                    {/* Progreso */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-24 mr-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getProgressColor(t.progreso || 0)}`}
                              style={{ width: `${t.progreso || 0}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 min-w-12">
                          {t.progreso || 0}%
                        </span>
                      </div>
                    </td>

                    {/* Prioridad */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(t.prioridad)}`}>
                          {t.prioridad || 'Media'}
                        </div>
                      </div>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditTarea(t)}
                          className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 border border-blue-200 transition-colors"
                          title="Editar tarea"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        
                        <button
                          className="px-3 py-1.5 text-xs bg-green-50 text-green-700 rounded-lg hover:bg-green-100 border border-green-200 transition-colors"
                          title="Ver detalles"
                          onClick={() => {
                            // Aquí puedes implementar la función para ver detalles
                            console.log("Ver detalles de tarea:", t);
                          }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>

                        <button
                          className="px-3 py-1.5 text-xs bg-red-50 text-red-700 rounded-lg hover:bg-red-100 border border-red-200 transition-colors"
                          title="Eliminar tarea"
                          onClick={() => {
                            // Aquí puedes implementar la función para eliminar
                            if (window.confirm("¿Estás seguro de eliminar esta tarea?")) {
                              console.log("Eliminar tarea:", t);
                            }
                          }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Footer con estadísticas */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{tareas.length}</span> tareas en total
              <span className="mx-2">•</span>
              <span className="text-green-600 font-medium">
                {tareas.filter(t => t.estado?.toLowerCase() === 'completada').length} completadas
              </span>
              <span className="mx-2">•</span>
              <span className="text-blue-600 font-medium">
                {tareas.filter(t => t.estado?.toLowerCase() === 'en progreso' || t.estado?.toLowerCase() === 'en_progreso').length} en progreso
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="text-xs text-gray-500">
                Mostrando {Math.min(tareas.length, 10)} por página
              </div>
              <div className="flex space-x-1">
                <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                  ←
                </button>
                <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de edición de tarea */}
      <EditarTareaModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        tarea={selectedTarea}
        usuarioId={selectedTarea?.usuario_ID || selectedTarea?.usuarioID}
        onSuccess={handleTareaUpdated}
      />
    </>
  );
}