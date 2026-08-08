namespace CustomerManagement.Core.Application.DTOs;

/// <summary>
/// DTO de respuesta con los datos del cliente
/// </summary>
public sealed record ClienteResponseDto(
    int IdCliente,
    string Identificacion,
    string Nombre,
    string Apellido,
    string Email,
    DateTime FechaCreacion,
    DateTime? FechaActualizacion
);
