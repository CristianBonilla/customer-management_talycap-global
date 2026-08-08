using CustomerManagement.Core.Application.DTOs;
using CustomerManagement.Core.Domain.Entities;

namespace CustomerManagement.Core.Application.Mappers;

public static class ClienteMapper
{
    public static ClienteResponseDto ToResponseDto(Cliente cliente) => new(
        cliente.IdCliente,
        cliente.Identificacion,
        cliente.Nombre,
        cliente.Apellido,
        cliente.Email,
        cliente.FechaCreacion,
        cliente.FechaActualizacion
    );
}
