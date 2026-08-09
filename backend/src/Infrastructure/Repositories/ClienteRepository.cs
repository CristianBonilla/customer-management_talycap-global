using CustomerManagement.Domain.Interfaces;
using CustomerManagement.Domain.Entities;
using CustomerManagement.Infrastructure.Data;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace CustomerManagement.Infrastructure.Repositories;

public sealed class ClienteRepository(ClientesDbContext context) : IClienteRepository
{
    private readonly ClientesDbContext _context = context;

    public async Task<Cliente?> ObtenerPorIdentificacionAsync(string identificacion, CancellationToken cancellationToken = default)
    {
        var param = new SqlParameter("@Identificacion", identificacion);

        var clientes = await _context.Clientes
            .FromSqlRaw("EXEC dbo.sp_ObtenerClientePorIdentificacion @Identificacion", param)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        return clientes.FirstOrDefault();
    }
}
