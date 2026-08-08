using CustomerManagement.Core.Application.Interfaces;
using CustomerManagement.Core.Domain.Entities;
using CustomerManagement.Infrastructure.Data;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace CustomerManagement.Infrastructure.Repositories;

public sealed class ClienteRepository : IClienteRepository
{
    private readonly ClientesDbContext _context;

    public ClienteRepository(ClientesDbContext context)
    {
        _context = context;
    }

    public async Task<Cliente?> ObtenerPorIdentificacionAsync(string identificacion, CancellationToken cancellationToken = default)
    {
        // Ejecuta el Stored Procedure via EF Core con parámetro tipado para evitar SQL injection
        var param = new SqlParameter("@Identificacion", identificacion);

        return await _context.Clientes
            .FromSqlRaw("EXEC dbo.sp_ObtenerClientePorIdentificacion @Identificacion", param)
            .AsNoTracking()
            .FirstOrDefaultAsync(cancellationToken);
    }
}
