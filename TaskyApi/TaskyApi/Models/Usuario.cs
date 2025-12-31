using System;
using System.Collections.Generic;

namespace TaskyApi.Models;

public partial class Usuario
{
    public int UsuarioId { get; set; }

    public int Responsable_ID { get; set; }

    public int RolId { get; set; }

    public string Nombre { get; set; } = null!;

    public string Apellido { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? Telefono { get; set; }

    public DateTime? FechaCreacion { get; set; }
    public bool Estado { get; set; }

    public DateTime? Ultimo_Acceso { get; set; }

    public int? Area_ID { get; set; }

    public string Password { get; set; } = null!;
}
