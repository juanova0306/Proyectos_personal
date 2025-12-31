using System;
using System.Collections.Generic;

namespace TaskyApi.Models;

public partial class Tarea
{
    public int Tarea_ID { get; set; }

    public int Usuario_ID { get; set; }

    public int Area_ID { get; set; }

    public string Titulo { get; set; } = null!;

    public string? Descripcion { get; set; }

    public string Estado { get; set; } = null!;

    public string Prioridad { get; set; } = null!;

    public string? Comentario { get; set; }

    public DateTime? FechaLimite { get; set; }

    public DateTime? FechaAsignacion { get; set; }
}
