using TaskyApi.DTOs.Rol;

namespace TaskyApi.Service.Roles
{
    public interface IRolService
    {
        Task<List<RolResponse>> Listar();
    }
}
