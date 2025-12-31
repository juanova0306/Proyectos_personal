using Microsoft.AspNetCore.Mvc;
using TaskyApi.Service.Rol;
using TaskyApi.Service.Roles;

namespace TaskyApi.Controllers
{
    [ApiController]
    [Route("api/rol")]
    public class RolController : ControllerBase
    {
        private readonly IRolService _rolService;

        public RolController(IRolService rolService)
        {
            _rolService = rolService;
        }

        [HttpGet]
        public async Task<IActionResult> Listar()
        {
            var roles = await _rolService.Listar();
            return Ok(roles);
        }
    }
}
