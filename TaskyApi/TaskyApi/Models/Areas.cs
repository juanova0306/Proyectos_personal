using System;
using System.Collections.Generic;

namespace TaskyApi.Models;

public partial class Areas
{
    public int Area_ID { get; set; }

    public string Area { get; set; }

    public string? Descripcion { get; set; }

    public DateTime? FechaCreacion { get; set; }

    public bool Estado { get; set; }
}
