using CustomerManagement.Domain.Entities;

namespace CustomerManagement.Domain.Interfaces;

public interface IClienteRepository
{
    Task<Cliente?> ObtenerPorIdentificacionAsync(string identificacion, CancellationToken cancellationToken = default);
}
