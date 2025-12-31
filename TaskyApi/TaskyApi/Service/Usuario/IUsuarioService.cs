using TaskyApi.DTOs.Usuario;

namespace TaskyApi.Service.Usuario
{
    public interface IUsuarioService
    {
        // DETALLE
        Task<UsuarioResponse> Obtener(int id);

        // LISTADO SEGÚN JERARQUÍA
        Task<List<UsuarioResponse>> ListarPorJerarquia(int usuarioLogueadoId);

        Task<bool> Crear(UsuarioCrear request);
        Task<bool> Actualizar(UsuarioEditar request, int id);
        Task<bool> Eliminar(int usuarioId);
    }
}
