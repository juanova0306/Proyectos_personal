namespace TaskyApi.DTOs.Usuario
{
    public class UsuarioResponse
    {
        public int UsuarioId { get; set; }

        public int RolId { get; set; }

        public string Nombre { get; set; } = null!;

        public string Apellido { get; set; } = null!;

        public string Email { get; set; } = null!;
        public DateTime? UltimoAcceso { get; set; }

        public int? AreaId { get; set; }
        public bool Estado { get; set; }
        public string Area { get; set; }
    }

    public class UsuarioCrear
    {
        public int RolId { get; set; }
        public int AreaId { get; set; }

        public string Nombre { get; set; } = null!;
        public string Apellido { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Telefono { get; set; }

        public bool Estado { get; set; }

    }


    public class UsuarioEditar
    {
        public int ResponsableId { get; set; }
        public int Usuario_ID { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public bool Estado { get; set; }

    }
    public class UsuarioEliminar
    {
        public int ResponsableId { get; set; }
        public int UsuarioId { get; set; }

    }

}
