using Microsoft.EntityFrameworkCore;
using TaskyApi.DTOs.Area;
using TaskyApi.DTOs.Rol;

namespace TaskyApi.Models
{
    public partial class TaskyContext : DbContext
    {
        public TaskyContext()
        {
        }

        public TaskyContext(DbContextOptions<TaskyContext> options)
            : base(options)
        {
        }

        // ===================== TABLAS =====================
        public virtual DbSet<Areas> Areas { get; set; }
        public virtual DbSet<Modulo> Modulos { get; set; }
        public virtual DbSet<ModulosYPermiso> ModulosYPermisos { get; set; }
        public virtual DbSet<Permiso> Permisos { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public virtual DbSet<Tarea> Tareas { get; set; }
        public virtual DbSet<Usuario> Usuarios { get; set; }

        // ===================== VIEWS / QUERIES =====================
        public DbSet<TareaQuery> TareaQuery { get; set; }
        public DbSet<UsuarioJerarquiaView> UsuarioJerarquiaView { get; set; }

        // ===================== STORED PROCEDURES (DTOs) =====================
        public DbSet<AreaResponse> AreaResponse { get; set; }
        public DbSet<RolResponse> RolResponse { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // ===================== AREAS =====================
            modelBuilder.Entity<Areas>(entity =>
            {
                entity.HasKey(e => e.Area_ID);

                entity.Property(e => e.Area_ID).HasColumnName("Area_ID");
                entity.Property(e => e.Area)
                    .HasMaxLength(50)
                    .IsUnicode(false);
                entity.Property(e => e.Descripcion)
                    .HasMaxLength(50)
                    .IsUnicode(false);
                entity.Property(e => e.FechaCreacion)
                    .HasColumnType("datetime")
                    .HasColumnName("Fecha_Creacion");
            });

            // ===================== MODULOS =====================
            modelBuilder.Entity<Modulo>(entity =>
            {
                entity.HasKey(e => e.ModuloId);

                entity.Property(e => e.ModuloId).HasColumnName("Modulo_ID");
                entity.Property(e => e.Modulo1)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("Modulo");
                entity.Property(e => e.FechaCreacion)
                    .HasColumnType("datetime")
                    .HasColumnName("Fecha_Creacion");
            });

            // ===================== MODULOS Y PERMISOS =====================
            modelBuilder.Entity<ModulosYPermiso>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.ToTable("Modulos_Y_Permisos");

                entity.Property(e => e.Id).HasColumnName("ID");
                entity.Property(e => e.AreaId).HasColumnName("Area_ID");
                entity.Property(e => e.ModuloId).HasColumnName("Modulo_ID");
                entity.Property(e => e.PermisoId).HasColumnName("Permiso_ID");
            });

            // ===================== PERMISOS =====================
            modelBuilder.Entity<Permiso>(entity =>
            {
                entity.HasKey(e => e.PermisoId);

                entity.Property(e => e.PermisoId).HasColumnName("Permiso_ID");
                entity.Property(e => e.Tipo)
                    .HasMaxLength(50)
                    .IsUnicode(false);
                entity.Property(e => e.Descripcion)
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            // ===================== ROLES =====================
            modelBuilder.Entity<Role>(entity =>
            {
                entity.HasKey(e => e.RolId);

                entity.Property(e => e.RolId).HasColumnName("Rol_ID");
                entity.Property(e => e.Tipo)
                    .HasMaxLength(50)
                    .IsUnicode(false);
                entity.Property(e => e.Descripcion)
                    .HasMaxLength(50)
                    .IsUnicode(false);
                entity.Property(e => e.FechaCreacion)
                    .HasColumnType("datetime")
                    .HasColumnName("Fecha_Creacion");
            });

            // ===================== TAREAS =====================
            modelBuilder.Entity<Tarea>(entity =>
            {
                entity.HasKey(e => e.Tarea_ID);

                entity.Property(e => e.Tarea_ID).HasColumnName("Tarea_ID");
                entity.Property(e => e.Area_ID).HasColumnName("Area_ID");
                entity.Property(e => e.Usuario_ID).HasColumnName("Usuario_ID");

                entity.Property(e => e.Titulo)
                    .HasMaxLength(50)
                    .IsUnicode(false);
                entity.Property(e => e.Descripcion)
                    .HasMaxLength(250)
                    .IsUnicode(false);
                entity.Property(e => e.Estado)
                    .HasMaxLength(50)
                    .IsUnicode(false);
                entity.Property(e => e.Prioridad)
                    .HasMaxLength(50)
                    .IsUnicode(false);
                entity.Property(e => e.Comentario)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.FechaAsignacion)
                    .HasColumnType("datetime")
                    .HasColumnName("Fecha_Asignacion");
                entity.Property(e => e.FechaLimite)
                    .HasColumnType("datetime")
                    .HasColumnName("Fecha_Limite");
            });

            // ===================== USUARIOS =====================
            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.HasKey(e => e.UsuarioId);

                entity.Property(e => e.UsuarioId).HasColumnName("Usuario_ID");
                entity.Property(e => e.Nombre)
                    .HasMaxLength(150)
                    .IsUnicode(false);
                entity.Property(e => e.Apellido)
                    .HasMaxLength(150)
                    .IsUnicode(false);
                entity.Property(e => e.Email)
                    .HasMaxLength(150)
                    .IsUnicode(false);
                entity.Property(e => e.Password)
                    .HasMaxLength(200)
                    .IsUnicode(false);
                entity.Property(e => e.Telefono)
                    .HasMaxLength(150)
                    .IsUnicode(false);

                entity.Property(e => e.Area_ID).HasColumnName("Area_ID");
                entity.Property(e => e.RolId).HasColumnName("Rol_ID");
                entity.Property(e => e.Responsable_ID).HasColumnName("Responsable_ID");

                entity.Property(e => e.FechaCreacion)
                    .HasColumnType("datetime")
                    .HasColumnName("Fecha_Creacion");
                entity.Property(e => e.Ultimo_Acceso)
                    .HasColumnType("datetime")
                    .HasColumnName("Ultimo_Acceso");
            });

            // ===================== KEYLESS: VIEWS / QUERIES =====================
            modelBuilder.Entity<UsuarioJerarquiaView>(entity =>
            {
                entity.HasNoKey();
                entity.ToView(null);
            });

            modelBuilder.Entity<TareaQuery>(entity =>
            {
                entity.HasNoKey();
                entity.ToView(null);
            });

            // ===================== KEYLESS: STORED PROCEDURES =====================
            modelBuilder.Entity<AreaResponse>(entity =>
            {
                entity.HasNoKey();
                entity.ToView(null);
            });

            modelBuilder.Entity<RolResponse>(entity =>
            {
                entity.HasNoKey();
                entity.ToView(null);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
