// EmailService.cs
using System.Net;
using System.Net.Mail;

namespace TaskyApi.Service.Email
{
    public interface IEmailService
    {
        Task EnviarAsync(string emailDestino, string asunto, string cuerpo);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task EnviarAsync(string emailDestino, string asunto, string cuerpo)
        {
            try
            {
                _logger.LogInformation($"Iniciando envío de email a: {emailDestino}");

                // Obtener configuración desde appsettings.json
                var smtpServer = _configuration["Email:SmtpServer"] ?? "smtp.gmail.com";
                var smtpPort = int.Parse(_configuration["Email:SmtpPort"] ?? "587");
                var smtpUsername = _configuration["Email:SmtpUsername"];
                var smtpPassword = _configuration["Email:SmtpPassword"];
                var fromEmail = _configuration["Email:FromEmail"] ?? smtpUsername;
                var enableSsl = bool.Parse(_configuration["Email:EnableSsl"] ?? "true");

                // Validar configuración
                if (string.IsNullOrEmpty(smtpUsername) || string.IsNullOrEmpty(smtpPassword))
                {
                    throw new Exception("Configuración de email incompleta. Verifique appsettings.json");
                }

                if (string.IsNullOrEmpty(emailDestino))
                {
                    throw new ArgumentException("El email destino no puede estar vacío");
                }

                _logger.LogInformation($"Configuración SMTP: {smtpServer}:{smtpPort}, SSL: {enableSsl}");

                using (var client = new SmtpClient(smtpServer, smtpPort))
                {
                    client.Credentials = new NetworkCredential(smtpUsername, smtpPassword);
                    client.EnableSsl = enableSsl;
                    client.Timeout = 30000; // 30 segundos

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress(fromEmail, "Tasky Sistema"),
                        Subject = asunto,
                        Body = cuerpo,
                        IsBodyHtml = true
                    };

                    mailMessage.To.Add(emailDestino);

                    _logger.LogInformation($"Enviando email...");
                    await client.SendMailAsync(mailMessage);
                    _logger.LogInformation($"Email enviado exitosamente a {emailDestino}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error enviando email a {emailDestino}");

                if (ex.InnerException != null)
                {
                    _logger.LogError("INNER EXCEPTION: " + ex.InnerException.Message);
                }

                throw;
            }

        }
    }
}