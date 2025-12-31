using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using TaskyApi.DTOs.Usuario;
using TaskyApi.Models;
using TaskyApi.Service.Email;

namespace TaskyApi.Service.Usuario
{
    public class UsuarioService : IUsuarioService
    {
        private readonly TaskyContext _Context;
        private readonly IEmailService _emailService;

        public UsuarioService(TaskyContext context, IEmailService emailService)
        {
            _Context = context;
            _emailService = emailService;
        }

        // ===============================
        // UTILIDAD: PASSWORD TEMPORAL
        // ===============================
        private string GenerarPasswordTemporal()
        {
            try
            {
                var guid = Guid.NewGuid().ToString("N");
                if (string.IsNullOrEmpty(guid) || guid.Length < 10)
                {
                    // Fallback seguro
                    var random = new Random();
                    return "Temp" + random.Next(100000, 999999).ToString();
                }
                return guid.Substring(0, 10);
            }
            catch (Exception)
            {
                return "TempPass123";
            }
        }

        // ===============================
        // OBTENER USUARIO POR ID
        // ===============================
        public async Task<UsuarioResponse> Obtener(int id)
        {
            try
            {
                var parametros = new SqlParameter("@Usuario_ID", id);

                var usuario = await _Context.Usuarios
                    .FromSqlRaw("EXEC Usuario @Usuario_ID", parametros)
                    .AsNoTracking()
                    .ToListAsync();

                var us = usuario.FirstOrDefault();
                if (us == null) return null;

                return new UsuarioResponse
                {
                    UsuarioId = us.UsuarioId,
                    RolId = us.RolId,
                    Nombre = us.Nombre,
                    Apellido = us.Apellido,
                    Email = us.Email,
                    AreaId = us.Area_ID,
                    Estado = us.Estado,
                    UltimoAcceso = us.Ultimo_Acceso
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener al usuario: {ex.Message}");
            }
        }

        // ===============================
        // LISTAR SEGÚN JERARQUÍA
        // ===============================
        public async Task<List<UsuarioResponse>> ListarPorJerarquia(int usuarioLogueadoId)
        {
            try
            {
                var parametro = new SqlParameter("@Usuario_ID", usuarioLogueadoId);

                var usuarios = await _Context.UsuarioJerarquiaView
                    .FromSqlRaw("EXEC Usuarios_Listar_PorJerarquia @Usuario_ID", parametro)
                    .AsNoTracking()
                    .ToListAsync();

                return usuarios.Select(us => new UsuarioResponse
                {
                    UsuarioId = us.UsuarioId,
                    RolId = us.RolId,
                    Nombre = us.Nombre,
                    Apellido = us.Apellido,
                    Email = us.Email,
                    AreaId = us.Area_ID,
                    Area = us.Area,
                    Estado = us.Estado,
                    UltimoAcceso = us.Ultimo_Acceso
                }).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al listar usuarios: {ex.Message}");
            }
        }

        public async Task<bool> Crear(UsuarioCrear request)
        {
            try
            {
                // 1. Generar contraseña temporal
                var passwordTemporal = GenerarPasswordTemporal();

                Console.WriteLine($"=== CREANDO USUARIO ===");
                Console.WriteLine($"Email: {request.Email}");
                Console.WriteLine($"Contraseña generada: {passwordTemporal}");
                Console.WriteLine($"Longitud: {passwordTemporal.Length}");

                // 2. Validar que la contraseña no sea null
                if (string.IsNullOrEmpty(passwordTemporal))
                {
                    throw new Exception("No se pudo generar la contraseña temporal");
                }

                // 3. Crear parámetros para el SP
                var telefonoValue = string.IsNullOrEmpty(request.Telefono) ?
                    (object)DBNull.Value : request.Telefono;

                var parametros = new[]
                {
                    new SqlParameter("@Rol_ID", request.RolId),
                    new SqlParameter("@Area_ID", request.AreaId),
                    new SqlParameter("@Nombre", request.Nombre),
                    new SqlParameter("@Apellido", request.Apellido),
                    new SqlParameter("@Email", request.Email),
                    new SqlParameter("@Telefono", telefonoValue),
                    new SqlParameter("@Estado", request.Estado),
                    new SqlParameter("@Password", passwordTemporal)
                };

                // 4. Ejecutar SP para crear usuario
                var filasAfectadas = await _Context.Database.ExecuteSqlRawAsync(
                    @"EXEC Usuarios_Guardar
              @Rol_ID, @Area_ID, @Nombre,
              @Apellido, @Email, @Telefono, @Estado, @Password",
                    parametros);

                Console.WriteLine($"SP ejecutado. Filas afectadas: {filasAfectadas}");

                // 5. Enviar email (manejando error por separado)
                try
                {
                    Console.WriteLine($"Enviando email a {request.Email}...");

                    await _emailService.EnviarAsync(
                        request.Email,
                        "Bienvenido a Tasky - Cuenta Creada",
                        $@"
                        <div style='font-family: Arial, sans-serif; padding: 20px;'>
                            <h2 style='color: #2563eb;'>¡Bienvenido a Tasky!</h2>
                            <p>Se ha creado una cuenta para ti en nuestro sistema.</p>
                            
                            <div style='background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;'>
                                <p><strong>Usuario:</strong> {request.Email}</p>
                                <p><strong>Contraseña temporal:</strong> <code style='background-color: #e5e7eb; padding: 2px 6px; border-radius: 3px;'>{passwordTemporal}</code></p>
                            </div>
                            
                            <p><strong>Instrucciones:</strong></p>
                            <ol>
                                <li>Inicia sesión con tu email y la contraseña temporal</li>
                                <li>Cambia tu contraseña en tu primer acceso</li>
                                <li>Si tienes problemas, contacta al administrador</li>
                            </ol>
                            
                            <p style='color: #6b7280; font-size: 12px; margin-top: 30px;'>
                                Este es un mensaje automático, por favor no responder.
                            </p>
                        </div>"
                    );

                    Console.WriteLine($"Email enviado exitosamente a {request.Email}");
                }
                catch (Exception emailEx)
                {
                    // Log del error de email pero NO fallar la creación del usuario
                    Console.WriteLine($"⚠️ ADVERTENCIA: Error enviando email:");
                    Console.WriteLine($"   Mensaje: {emailEx.Message}");
                    Console.WriteLine($"   El usuario fue creado exitosamente pero no se pudo enviar el email.");

                    // Puedes almacenar este error en una tabla de logs si lo necesitas
                    // _logger.LogWarning(emailEx, "Error enviando email de bienvenida");
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"=== ERROR EN CREAR USUARIO ===");
                Console.WriteLine($"Mensaje: {ex.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");

                if (ex.InnerException != null)
                {
                    Console.WriteLine($"InnerException: {ex.InnerException.Message}");
                }

                Console.WriteLine($"===============================");
                throw new Exception($"Error al crear al usuario: {ex.Message}");
            }
        }

        // ===============================
        // ACTUALIZAR USUARIO
        // ===============================
        public async Task<bool> Actualizar(UsuarioEditar request, int id)
        {
            try
            {
                await _Context.Database.ExecuteSqlRawAsync(
                    @"EXEC Usuarios_Editar
              @Usuario_ID = @Usuario_ID,
              @Email = @Email,
              @Password = @Password,
              @Estado = @Estado",
                    new[]
                    {
                new SqlParameter("@Usuario_ID", id),
                new SqlParameter("@Email", request.Email),
                new SqlParameter("@Password",
                    string.IsNullOrWhiteSpace(request.Password)
                        ? (object)DBNull.Value
                        : request.Password),
                new SqlParameter("@Estado", request.Estado)
                    }
                );

                return true;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error desde SQL: {ex.InnerException?.Message ?? ex.Message}");
            }
        }


        // ===============================
        // ELIMINAR USUARIO
        // ===============================
        public async Task<bool> Eliminar(int usuarioId)
        {
            try
            {
                var parametros = new[]
                {
            new SqlParameter("@Usuario_ID", usuarioId)
        };

                await _Context.Database.ExecuteSqlRawAsync(
                    "EXEC Usuarios_Eliminar @Usuario_ID",
                    parametros
                );

                return true;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al eliminar al usuario: {ex.Message}");
            }
        }

    }
}