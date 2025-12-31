namespace TaskyApi.DTOs.AUTH
{
    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; } 
    }
    public class LoginResponse
    {
        public string Nombre { get; set; } 
        public string Apellido { get; set; }
        public string Email { get; set; }
        public int Rol_ID { get; set; }
        public int Area_ID { get; set; }
        public DateTime Ultimo_Acceso { get; set; }

    }

}
