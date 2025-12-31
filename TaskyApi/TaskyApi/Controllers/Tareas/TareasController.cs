using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.SqlServer.Query.Internal;
using System.Security.Claims;
using TaskyApi.DTOs.Tareas;
using TaskyApi.DTOs.Usuario;
using TaskyApi.Service.Tareas;
namespace TaskyApi.Controllers.Tareas
{
    [ApiController]
    [Route("api/[controller]")]
    public class TareasController : ControllerBase
    {
        private readonly ITareasService _tareasService;

        public TareasController(ITareasService tareasService)
        {
            _tareasService = tareasService;
        }

        // DASHBOARD
        [HttpGet("Obtener")]
        public async Task<IActionResult> Obtener()
        {
            var usuarioId = int.Parse(User.FindFirst("UsuarioId").Value);

            var tareas = await _tareasService.ObtenerPorUsuario(usuarioId);

            return Ok(new { mensaje = "OK", response = tareas });
        }

        // DETALLE
        [HttpGet("Obtener/{id:int}")]
        public async Task<IActionResult> Obtener(int id)
        {
            var tarea = await _tareasService.Obtener(id);

            if (tarea == null)
                return NotFound(new { mensaje = "Tarea no encontrada" });

            return Ok(new { mensaje = "OK", response = tarea });
        }

        [Authorize]
        [HttpPost]
        [Route("Crear")]
        public async Task<IActionResult> Crear([FromBody] TareaCrear request)
        {
            try
            {
                var usuarioId = int.Parse(User.FindFirst("UsuarioId").Value);
                var RolId = int.Parse(User.FindFirst("RolId").Value);

                var nuevaTareaID = await _tareasService.Crear(request, usuarioId);

                return Ok
                    (
                        new
                        {
                            mensaje = "Tarea creada correctamente"
                        }
                    );
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = "Error al crear la tarea", detalle = ex.Message });

            }
        }
        [Authorize]
        [HttpPut]
        [Route("Actualizar/{id:int}")]
        public async Task<IActionResult>Actualizar(int id, [FromBody] TareaActualizar request)
        {
            try
            {
                var resultado = await _tareasService.Actualizar(request, id);
                return Ok(new {mensaje ="Tarea actualizado exitosamente"});
            }catch(Exception ex)
            {
                return BadRequest(new
                {
                    mensaje = "Error al actualizar la tarea",
                    detalle = ex.Message
                });
            }
        }

        [Authorize]
        [HttpDelete]
        [Route("Eliminar/{tareaId:int}")]
        public async Task<IActionResult> Eliminar(int tareaId)
        {
            try
            {
                var claim =
                     User.FindFirst("UsuarioId") ??
                     User.FindFirst("Usuario:ID") ??
                     User.FindFirst(ClaimTypes.NameIdentifier);

                if (claim == null)
                    return Unauthorized("Token invalido");
                int ejecutoId = int.Parse(claim.Value);

                var resultados = await _tareasService.Eliminar(tareaId, ejecutoId);

                return Ok(new
                {
                    success = true,
                    message = "Tarea eliminada " +
                    " correctamente."
                });
            }catch(Exception ex)
            {
                return BadRequest(new
                {
                    mensaje = " Error al eliminar la tarea",
                    detalle = ex.Message
                });
            }

        }
    }
}
