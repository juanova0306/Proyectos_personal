using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using TaskyApi.DTOs.Rol;
using TaskyApi.Models;
using TaskyApi.Service.Roles;

namespace TaskyApi.Service.Rol
{
    public class RolService : IRolService
    {
        private readonly TaskyContext _context;

        public RolService(TaskyContext context)
        {
            _context = context;
        }

        public async Task<List<RolResponse>> Listar()
        {
            try
            {
                var roles = await _context.Roles
                    .FromSqlRaw("EXEC Rol") 
                    .AsNoTracking()
                    .ToListAsync();

                return roles.Select(r => new RolResponse
                {
                    RolId = r.RolId,
                    Tipo = r.Tipo,
                    Descripcion = r.Descripcion
                }).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al listar roles: {ex.Message}");
            }
        }

    }
}
