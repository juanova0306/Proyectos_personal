using Microsoft.EntityFrameworkCore;

[Keyless]
public class TareaQuery
{
    public int Tarea_ID { get; set; }
    public int Usuario_ID { get; set; }
    public int Area_ID { get; set; }
    public string Titulo { get; set; }
    public string Descripcion { get; set; }
    public string Estado { get; set; }
    public string Prioridad { get; set; }
    public string? Comentario { get; set; }
    public DateTime? FechaLimite { get; set; }
    public DateTime? FechaAsignacion { get; set; }
}
