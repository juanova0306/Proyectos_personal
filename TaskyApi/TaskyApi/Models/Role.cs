using System;
using System.Collections.Generic;

namespace TaskyApi.Models;

public partial class Role
{
    public int RolId { get; set; }

    public string Tipo { get; set; } = null!;

    public string? Descripcion { get; set; }

    public DateTime? FechaCreacion { get; set; }

    public bool Estado { get; set; }
}
