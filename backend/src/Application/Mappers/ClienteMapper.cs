using CustomerManagement.Contracts.DTOs;
using CustomerManagement.Domain.Entities;

namespace CustomerManagement.Application.Mappers;

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
