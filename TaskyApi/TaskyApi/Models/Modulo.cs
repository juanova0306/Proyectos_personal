using System;
using System.Collections.Generic;

namespace TaskyApi.Models;

public partial class Modulo
{
    public int ModuloId { get; set; }

    public string Modulo1 { get; set; } = null!;

    public DateTime? FechaCreacion { get; set; }

    public bool Estado { get; set; }
}
