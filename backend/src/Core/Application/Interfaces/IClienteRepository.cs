using CustomerManagement.Core.Domain.Entities;

namespace CustomerManagement.Core.Application.Interfaces;

public interface IClienteRepository
{
    Task<Cliente?> ObtenerPorIdentificacionAsync(string identificacion, CancellationToken cancellationToken = default);
}
