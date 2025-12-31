using Microsoft.AspNetCore.Mvc;
using TaskyApi.Service.Area;

namespace TaskyApi.Controllers
{
    [ApiController]
    [Route("api/area")]
    public class AreaController : ControllerBase
    {
        private readonly IAreaService _areaService;

        public AreaController(IAreaService areaService)
        {
            _areaService = areaService;
        }

        [HttpGet]
        public async Task<IActionResult> Listar()
        {
            var areas = await _areaService.Listar();
            return Ok(areas);
        }
    }
}
