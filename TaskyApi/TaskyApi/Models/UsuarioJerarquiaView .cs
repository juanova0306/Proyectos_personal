namespace TaskyApi.Models
{
    public class UsuarioJerarquiaView
    {
        public int UsuarioId { get; set; }
        public int RolId { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string Email { get; set; }
        public int? Area_ID { get; set; }
        public string Area { get; set; }
        public DateTime? Ultimo_Acceso { get; set; }
        public bool Estado { get; set; }
    }
}
