using CustomerManagement.Core.Application.DTOs;
using CustomerManagement.Core.Application.UseCases;
using Microsoft.AspNetCore.Mvc;

namespace CustomerManagement.API.Controllers;

/// <summary>
/// Controlador para la gestión y consulta de clientes.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class ClientesController(ObtenerClienteUseCase obtenerClienteUseCase, ILogger<ClientesController> logger) : ControllerBase
{
    private readonly ObtenerClienteUseCase _obtenerClienteUseCase = obtenerClienteUseCase;
    private readonly ILogger<ClientesController> _logger = logger;

    /// <summary>
    /// Obtiene los datos de un cliente a partir de su número de identificación.
    /// </summary>
    /// <param name="identificacion">Número de identificación del cliente (cédula, NIT, pasaporte, etc.).</param>
    /// <param name="cancellationToken">Token de cancelación de la operación.</param>
    /// <returns>Datos completos del cliente si existe en el sistema.</returns>
    /// <response code="200">Retorna los datos del cliente encontrado.</response>
    /// <response code="400">La identificación proporcionada no es válida (vacía o nula).</response>
    /// <response code="404">No se encontró ningún cliente con la identificación indicada.</response>
    /// <response code="500">Error interno del servidor al procesar la solicitud.</response>
    [HttpGet("{identificacion}")]
    [ProducesResponseType(typeof(ClienteResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(object), StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetByIdentificacion([FromRoute] string identificacion, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Buscando cliente con identificación: {Identificacion}", identificacion);

        try
        {
            var cliente = await _obtenerClienteUseCase.ExecuteAsync(identificacion, cancellationToken);

            if (cliente is null)
            {
                _logger.LogWarning("Cliente no encontrado para identificación: {Identificacion}", identificacion);
                return NotFound(new { mensaje = $"No se encontró un cliente con la identificación '{identificacion}'." });
            }

            return Ok(cliente);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { mensaje = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al consultar cliente con identificación: {Identificacion}", identificacion);

            return StatusCode(StatusCodes.Status500InternalServerError,
                new { mensaje = "Error interno al procesar la solicitud." });
        }
    }
}
