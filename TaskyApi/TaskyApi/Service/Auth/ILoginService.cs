using TaskyApi.DTOs.Usuario;
using TaskyApi.Models;

namespace TaskyApi.Service.Auth
{
    public interface ILoginService
    {
        Task<UsuarioResponse> Login(string Email, string Password);
    }
}
