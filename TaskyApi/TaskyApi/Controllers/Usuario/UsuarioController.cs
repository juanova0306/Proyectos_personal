using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
using TaskyApi.DTOs.Usuario;
using TaskyApi.Models;
using TaskyApi.Service.Usuario;
namespace TaskyApi.Controllers.Usuario
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioService _usuarioService;
        public UsuarioController(IUsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        [Authorize]
        [HttpGet]
        [Route("Listar")]
        public async Task<IActionResult> Listar()
        {
            try
            {
                var usuarioIdClaim = User.Claims
                    .FirstOrDefault(c => c.Type == "UsuarioId");

                if (usuarioIdClaim == null)
                    return Unauthorized(new { mensaje = "No se pudo obtener el usuario logueado" });

                int usuarioLogueadoId = int.Parse(usuarioIdClaim.Value);

                var usuarios = await _usuarioService.ListarPorJerarquia(usuarioLogueadoId);

                return Ok(new
                {
                    mensaje = "Ok",
                    total = usuarios.Count,
                    response = usuarios
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    mensaje = "Error al listar usuarios",
                    detalle = ex.Message
                });
            }
        }


        [Authorize]
        [HttpGet]
        [Route("Obtener/{id:int}")]
        public async Task<IActionResult> Obtener(int id)
        {
            try
            {
                var usuario = await _usuarioService.Obtener(id);

                if (usuario == null)
                {
                    return NotFound(new { mensaje = "Usuario no encontrado" });
                }
                return Ok(new { mensaje = "Ok", response = usuario });
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = "Error al obtener el usuario", detalle = ex.Message });
            }
        }

        [Authorize]
        [HttpPost]
        [Route("Crear")]
        public async Task<IActionResult> Crear([FromBody] UsuarioCrear request)
        {
            try
            {
                await _usuarioService.Crear(request);
                return Ok(new { mensaje = "Usuario creado exitosamente" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = "Error al crear al usuario", detalle = ex.Message });
            }
        }

        [Authorize]
        [HttpPut]
        [Route("Actualizar/{id:int}")]
        public async Task<IActionResult> Actualizar(int id, [FromBody] UsuarioEditar request)
        {
            try
            {
                var resultado = await _usuarioService.Actualizar(request, id);

                // SI resultado es true = actualizado correctamente
                return Ok(new { mensaje = "Usuario actualizado exitosamente" });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    mensaje = "Error al actualizar el usuario",
                    detalle = ex.Message
                });
            }
        }


        [Authorize]
        [HttpDelete("{usuarioId:int}")]
        public async Task<IActionResult> Eliminar(int usuarioId)
        {
            try
            {
                var usuarioLogueadoIdClaim = User.Claims
                    .FirstOrDefault(c => c.Type == "UsuarioId");

                if (usuarioLogueadoIdClaim == null)
                    return Unauthorized(new { mensaje = "No se pudo obtener el ID del usuario logueado" });

                int usuarioLogueadoId = int.Parse(usuarioLogueadoIdClaim.Value);

                var resultado = await _usuarioService.Eliminar(usuarioId);

                if (!resultado)
                    return NotFound(new { mensaje = "Usuario no encontrado" });

                return Ok(new { mensaje = "Usuario eliminado exitosamente" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = "Error al eliminar el usuario", detalle = ex.Message });
            }
        }


    }
}
