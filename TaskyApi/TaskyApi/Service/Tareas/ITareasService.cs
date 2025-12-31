
using TaskyApi.DTOs.Tareas;

namespace TaskyApi.Service.Tareas
{
    public interface ITareasService
    {
        // DASHBOARD
        Task<List<TareaObtener>> ObtenerPorUsuario(int usuarioId);

        // DETALLE
        Task<TareaObtener> Obtener(int tareaId);

        Task<int> Crear(TareaCrear request, int usuarioIdToken);
        Task<bool> Actualizar(TareaActualizar request, int tareaId);
        Task<bool> Eliminar(int tareaId, int usuarioId);
    }
}
