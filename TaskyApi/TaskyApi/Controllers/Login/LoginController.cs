using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TaskyApi.DTOs.AUTH;
using TaskyApi.DTOs.Usuario;
using TaskyApi.Service.Auth;

namespace TaskyApi.Controllers.Login
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly ILoginService _loginService;
        private readonly IConfiguration _config;

        public LoginController(ILoginService loginService, IConfiguration config)
        {
            _loginService = loginService;
            _config = config;
        }


        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var usuario = await _loginService.Login(request.Email, request.Password);

            if (usuario == null)
            {
                return Unauthorized(new { mensaje = "Credenciales incorrectas" });
            }

            // Generar token JWT
            var token = GenerarToken(usuario);

            return Ok(new
            {
                mensaje = "Acceso exitoso",
                token,
                usuario
            });
        }


        // ============================================================
        //  FUNCIÓN PARA GENERAR TOKEN
        // ============================================================
        private string GenerarToken(UsuarioResponse usuario)
        {
            // Clave secreta (mínimo 32 caracteres)
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"])
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim("UsuarioId", usuario.UsuarioId.ToString()),
                new Claim("Email", usuario.Email),
                new Claim("RolId", usuario.RolId.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(4),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
