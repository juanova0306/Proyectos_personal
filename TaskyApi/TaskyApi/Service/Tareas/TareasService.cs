using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using TaskyApi.Models;
using TaskyApi.DTOs.Tareas;

namespace TaskyApi.Service.Tareas
{
    public class TareasService : ITareasService
    {
        private readonly TaskyContext _context;

        public TareasService(TaskyContext context)
        {
            _context = context;
        }
        // DASHBOARD
        public async Task<List<TareaObtener>> ObtenerPorUsuario(int usuarioId)
        {
            var param = new SqlParameter("@Usuario_ID", usuarioId);

            var tareas = await _context.TareaQuery
                .FromSqlRaw(
                    "EXEC Tareas_PorUsuario @Usuario_ID = @Usuario_ID",
                    param
                )
                .AsNoTracking()
                .ToListAsync();

            return tareas.Select(t => new TareaObtener
            {
                Tarea_ID = t.Tarea_ID,
                Usuario_ID = t.Usuario_ID,
                Area_ID = t.Area_ID,
                Titulo = t.Titulo,
                Descripcion = t.Descripcion,
                Estado = t.Estado,
                Prioridad = t.Prioridad,
                Comentario = t.Comentario,
                FechaLimite = t.FechaLimite,
                FechaAsignacion = t.FechaAsignacion
            }).ToList();
        }


        // DETALLE
        public async Task<TareaObtener> Obtener(int tareaId)
        {
            var param = new SqlParameter("@Tarea_ID", tareaId);

            var tarea = await _context.Tareas
                .FromSqlRaw(
                    "EXEC Tarea @Tarea_ID = @Tarea_ID",
                    param
                )
                .ToListAsync();

            var t = tarea.FirstOrDefault();
            if (t == null) return null;

            return new TareaObtener
            {
                Tarea_ID = t.Tarea_ID,
                Area_ID = t.Area_ID,
                Usuario_ID = t.Usuario_ID,
                Titulo = t.Titulo,
                Descripcion = t.Descripcion,
                Estado = t.Estado,
                Prioridad = t.Prioridad,
                Comentario = t.Comentario,
                FechaAsignacion = t.FechaAsignacion,
                FechaLimite = t.FechaLimite
            };
        }

        //CREAR
        public async Task<int> Crear(TareaCrear request, int usuarioIdToken)
        {
            try
            {
                var parametros = new[]
                {
                    new SqlParameter("@Usuario_ID",usuarioIdToken),
                    new SqlParameter("@Area_ID",request.Area_ID),
                    new SqlParameter("@Titulo",request.Titulo),
                    new SqlParameter("@Descripcion",request.Descripcion),
                    new SqlParameter("@Estado",request.Estado),
                    new SqlParameter("@Prioridad",request.Prioridad),
                    new SqlParameter("@Comentario",request.Comentario)
                };
                var resultado = await _context.Database
                    .ExecuteSqlRawAsync(@"EXEC Tareas_Guardar @Usuario_ID,@Area_ID,@Titulo,
                                        @Descripcion,@Estado,@Prioridad,@Comentario", parametros);
                

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al crear la tarea: {ex.Message}");
            }
        }
        //Actualizar
        public async Task<bool> Actualizar(TareaActualizar request, int id)
        {
            var parametros = new[]
            {
        new SqlParameter("@Tarea_ID", id),
        new SqlParameter("@Estado", request.Estado),
        new SqlParameter("@Prioridad", request.Prioridad)
    };

            await _context.Database.ExecuteSqlRawAsync(
                @"EXEC Tareas_Editar
          @Tarea_ID,
          @Estado,
          @Prioridad",
                parametros);

            return true;
        }

        //eliminar
        public async Task<bool> Eliminar(int tareaId, int usuarioId)
        {
            try
            {
                var parametros = new[]
                {
                    new SqlParameter("@Tarea_ID",tareaId),
                    new SqlParameter("@ResponsableEjecuta_ID",usuarioId)
                };
                await _context.Database.ExecuteSqlRawAsync(
                    @"EXEC Tareas_Eliminar
                    @Tarea_ID,
                    @ResponsableEjecuta_ID", parametros);

                return true;
                
            }catch(Exception ex)
            {
                throw new Exception($"Error al eliminar la tarea: {ex.Message}");
            }
        }
    }
}
