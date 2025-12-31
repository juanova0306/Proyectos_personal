using System;
using System.Collections.Generic;

namespace TaskyApi.Models;

public partial class ModulosYPermiso
{
    public int Id { get; set; }

    public int ModuloId { get; set; }

    public int PermisoId { get; set; }

    public int? AreaId { get; set; }
}
