using System;
using System.Collections.Generic;

namespace TaskyApi.Models;

public partial class Permiso
{
    public int PermisoId { get; set; }

    public string? Tipo { get; set; }

    public string? Descripcion { get; set; }
}
