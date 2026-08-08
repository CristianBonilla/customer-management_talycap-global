-- Base de Datos: DBClientes
-- Descripción: Estructura de persistencia para gestión de clientes
-- Fecha: 2026-08-08

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'DBClientes')
BEGIN
    CREATE DATABASE DBClientes;
    PRINT 'Base de datos DBClientes creada exitosamente.';
END
GO

USE DBClientes;
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Clientes' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    CREATE TABLE dbo.Clientes (
        IdCliente INT PRIMARY KEY IDENTITY(1, 1) NOT NULL,
        Identificacion NVARCHAR(20) UNIQUE NOT NULL,
        Nombre NVARCHAR(100) NOT NULL,
        Apellido NVARCHAR(100) NOT NULL,
        Email NVARCHAR(150) NOT NULL,
        FechaCreacion DATETIME2 DEFAULT GETUTCDATE() NOT NULL,
        FechaActualizacion DATETIME2 NULL
    );
    
    CREATE NONCLUSTERED INDEX IX_Clientes_Identificacion 
        ON dbo.Clientes(Identificacion);
    
    PRINT 'Tabla Clientes creada exitosamente.';
END
GO

-- STORED PROCEDURE: sp_ObtenerClientePorIdentificacion
-- Descripción: Obtiene los datos de un cliente por su número de identificación
-- Parámetros:
--   @Identificacion NVARCHAR(20) - Número de identificación del cliente
-- Retorna: Registro completo del cliente o conjunto vacío si no existe

IF NOT EXISTS (SELECT * FROM sys.objects WHERE name = 'sp_ObtenerClientePorIdentificacion' AND type = 'P')
BEGIN
    EXEC sp_executesql N'
    CREATE PROCEDURE dbo.sp_ObtenerClientePorIdentificacion
        @Identificacion NVARCHAR(20)
    AS
    BEGIN
        SET NOCOUNT ON;
        
        SELECT 
            IdCliente,
            Identificacion,
            Nombre,
            Apellido,
            Email,
            FechaCreacion,
            FechaActualizacion
        FROM dbo.Clientes
        WHERE Identificacion = @Identificacion;
        
        -- Retornar 0 si la consulta fue exitosa, o -1 si no se encontró registro
        IF @@ROWCOUNT = 0
        BEGIN
            RETURN -1;
        END
        
        RETURN 0;
    END
    ';
    PRINT 'Stored Procedure sp_ObtenerClientePorIdentificacion creado exitosamente.';
END
GO

IF (SELECT COUNT(*) FROM dbo.Clientes) = 0
BEGIN
    INSERT INTO dbo.Clientes (Identificacion, Nombre, Apellido, Email)
    VALUES
        ('1234567890', 'Juan', 'García López', 'juan.garcia@email.com'),
        ('9876543210', 'María', 'Rodríguez Pérez', 'maria.rodriguez@email.com'),
        ('5555666777', 'Carlos', 'Martínez Gómez', 'carlos.martinez@email.com'),
        ('1111222333', 'Ana', 'Fernández Silva', 'ana.fernandez@email.com'),
        ('4444555666', 'Miguel', 'López Herrera', 'miguel.lopez@email.com'),
        ('7777888999', 'Isabel', 'Sánchez Torres', 'isabel.sanchez@email.com');
    
    PRINT 'Se insertaron 6 registros de prueba exitosamente.';
END
ELSE
BEGIN
    PRINT 'La tabla Clientes ya contiene datos. No se insertaron registros adicionales.';
END
GO

SELECT * FROM dbo.Clientes;
GO
