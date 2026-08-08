#!/bin/bash
# Script de arranque para SQL Server: inicializa la BD automáticamente al primer inicio

set -e

# Iniciar SQL Server en background
/opt/mssql/bin/sqlservr &
MSSQL_PID=$!

echo ">> Esperando que SQL Server esté disponible..."
until /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -Q "SELECT 1" -b > /dev/null 2>&1; do
    echo "   SQL Server no disponible aún, reintentando en 5 segundos..."
    sleep 5
done

echo ">> SQL Server listo. Ejecutando script de inicialización..."
/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -d master -i /scripts/init-db.sql

echo ">> Base de datos inicializada exitosamente."

# Mantener SQL Server como proceso principal (foreground)
wait $MSSQL_PID
