using CustomerManagement.Application.Mappers;
using CustomerManagement.Contracts.DTOs;
using CustomerManagement.Domain.Interfaces;

namespace CustomerManagement.Application.UseCases;

public sealed class ObtenerClienteUseCase(IClienteRepository repository)
{
    private readonly IClienteRepository _repository = repository;

    public async Task<ClienteResponseDto?> ExecuteAsync(string identificacion, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(identificacion))
            throw new ArgumentException("La identificación no puede estar vacía.", nameof(identificacion));

        var cliente = await _repository.ObtenerPorIdentificacionAsync(identificacion.Trim(), cancellationToken);

        return cliente is null ? null : ClienteMapper.ToResponseDto(cliente);
    }
}
