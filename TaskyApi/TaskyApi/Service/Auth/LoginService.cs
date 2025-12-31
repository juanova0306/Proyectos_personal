using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;
using TaskyApi.DTOs.Usuario;
using TaskyApi.Models;
namespace TaskyApi.Service.Auth
{
    public class LoginService : ILoginService
    {
        public readonly TaskyContext _Contex;

        public LoginService(TaskyContext contex)
        {
            _Contex = contex;
        }

        public async Task<UsuarioResponse> Login(string Email, string Password)
        {
            using var command = _Contex.Database.GetDbConnection().CreateCommand();
            command.CommandText = "Login";
            command.CommandType = CommandType.StoredProcedure;

            command.Parameters.Add(new SqlParameter("@Email", Email));
            command.Parameters.Add(new SqlParameter("@Password", Password));

            await _Contex.Database.OpenConnectionAsync();

            using var result = await command.ExecuteReaderAsync();
            if (await result.ReadAsync())
            {
                var user = new UsuarioResponse
                {
                    UsuarioId = result.GetInt32(result.GetOrdinal("Usuario_ID")),
                    Nombre = result.GetString(result.GetOrdinal("Nombre")),
                    Apellido = result.GetString(result.GetOrdinal("Apellido")),
                    Email = result.GetString(result.GetOrdinal("Email")),
                    RolId = result.GetInt32(result.GetOrdinal("Rol_ID")),
                    AreaId = result.GetInt32(result.GetOrdinal("Area_ID")),
                    UltimoAcceso = result.GetDateTime(result.GetOrdinal("Ultimo_Acceso"))
                };

                return user;
            }

            return null;
        }

    }
}
