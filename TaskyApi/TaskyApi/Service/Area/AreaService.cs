using Microsoft.EntityFrameworkCore;
using TaskyApi.DTOs.Area;
using TaskyApi.Models;

namespace TaskyApi.Service.Area
{
    public class AreaService : IAreaService
    {
        private readonly TaskyContext _context;

        public AreaService(TaskyContext context)
        {
            _context = context;
        }

        public async Task<List<AreaResponse>> Listar()
        {
            var areas = await _context.Areas
                .FromSqlRaw("EXEC Area")
                .AsNoTracking()
                .ToListAsync();   // 👈 AWAIT SOLO AQUÍ

            return areas.Select(a => new AreaResponse
            {
                Area_ID = a.Area_ID,
                Area = a.Area,
                Descripcion = a.Descripcion
            }).ToList();          // 👈 LINQ en memoria, SIN await
        }


    }
}
