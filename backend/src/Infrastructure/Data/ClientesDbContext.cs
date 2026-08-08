using CustomerManagement.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CustomerManagement.Infrastructure.Data;

public class ClientesDbContext(DbContextOptions<ClientesDbContext> options) : DbContext(options)
{
    public DbSet<Cliente> Clientes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.ToTable("Clientes");
            entity.HasKey(e => e.IdCliente);
            entity.Property(e => e.IdCliente).ValueGeneratedOnAdd();
            entity.Property(e => e.Identificacion).HasMaxLength(20).IsRequired();
            entity.Property(e => e.Nombre).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Apellido).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Email).HasMaxLength(150).IsRequired();
            entity.Property(e => e.FechaCreacion).HasColumnType("datetime2");
            entity.Property(e => e.FechaActualizacion).HasColumnType("datetime2");
            entity.HasIndex(e => e.Identificacion).IsUnique();
        });
    }
}
