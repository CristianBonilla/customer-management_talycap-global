# Customer Management — Prueba Técnica Fullstack

Aplicación de gestión de clientes con **.NET 10** + **Angular 20** + **SQL Server 2022**

## 🏗️ Stack Tecnológico

| Capa | Tecnología | Versión |
| ------ | ----------- | --------- |
| Backend | .NET SDK | 10.0 |
| Base de datos | SQL Server | 2022 |
| Frontend | Angular | 20.0 |
| State Management | NGXS | 20.0 |
| UI Components | PrimeNG | 19.0 |
| Node.js | Node.js | 22 |
| Containerización | Docker | Latest |

## 📦 Requisitos Previos

1. **Docker Desktop** (recomendado)
   - [Descargar](https://www.docker.com/products/docker-desktop)

2. **Alternativa: Instalación local**
   - .NET 10 SDK ([descargar](https://dotnet.microsoft.com/download))
   - Node.js 22 ([descargar](https://nodejs.org))
   - SQL Server 2022 o LocalDB

## 🚀 Ejecución con Docker Compose (Recomendado)

```bash
# Clonar repositorio
git clone https://github.com/CristianBonilla/customer-management_talycap-global.git
cd customer-management_talycap-global

# Iniciar todo (SQL Server + API + Frontend)
docker-compose up --build

# Acceder a la aplicación
# Frontend:    http://localhost
# API Swagger: http://localhost:8080/index.html
# SQL Server:  localhost:1433 (sa / Customer__Management)
```

**Nota:** La BD se inicializa automáticamente al primer inicio. Espera 2-3 minutos a que SQL Server esté listo.

Para ver logs:

```bash
docker-compose logs -f api       # API
docker-compose logs -f sqlserver # SQL Server
docker-compose logs -f frontend  # Frontend (nginx)
```

Para detener:

```bash
docker-compose down
```

---

## 🏃 Ejecución Local (Desarrollo)

### Paso 1: Base de Datos

**LocalDB (Windows):**

```bash
cd scripts
sqlcmd -S "(localdb)\mssqllocaldb" -f 65001 -i "init-db.sql" -b
```

**Docker (SQL Server solo):**

```bash
docker run -e "ACCEPT_EULA=Y" \
  -e "SA_PASSWORD=Customer__Management" \
  -p 1433:1433 \
  mcr.microsoft.com/mssql/server:2022-latest
```

### Paso 2: Backend

```bash
cd backend
dotnet restore
dotnet build
dotnet run --project src/API/CustomerManagement.API.csproj

# API lista en http://localhost:5000
# Swagger UI: http://localhost:5000/index.html
```

### Paso 3: Frontend

**En otra terminal:**

```bash
cd frontend
npm install
npm start

# Frontend ready en http://localhost:4200
```

---

## 📡 Uso de la API

### Endpoint Principal

```http
GET /api/clientes/{identificacion}
```

### Ejemplos

#### **Éxito (200 OK)**

```bash
curl -X GET "http://localhost:5000/api/clientes/1234567890" \
  -H "accept: application/json"
```

**Respuesta:**

```json
{
  "idCliente": 1,
  "identificacion": "1234567890",
  "nombre": "Juan",
  "apellido": "García López",
  "email": "juan.garcia@email.com",
  "fechaCreacion": "2026-08-08T12:00:00",
  "fechaActualizacion": null
}
```

**Status:** `200 OK`

---

#### **No Encontrado (404)**

```bash
curl -X GET "http://localhost:5000/api/clientes/9999999999"
```

**Respuesta:**

```json
{
  "mensaje": "No se encontró un cliente con la identificación '9999999999'."
}
```

### Clientes de Prueba

| ID | Nombre | Apellido | Email |
| ---- | -------- | ---------- | ------- |
| 1234567890 | Juan | García López | <juan.garcia@email.com> |
| 9876543210 | María | Rodríguez Pérez | <maria.rodriguez@email.com> |
| 5555666777 | Carlos | Martínez Gómez | <carlos.martinez@email.com> |

---

## 🎨 Frontend

**Funcionalidades:**

- Búsqueda de clientes por identificación
- Vista previa en card + modal interactivo
- **Dark Mode** (click en luna en navbar)
- Validaciones + notificaciones (toastr)
- State Management con NGXS

**Estructura:**

```text
frontend/src/app/
├── core/            ← Servicios (ClienteService, ThemeService)
├── layout/          ← Navbar + Sidebar
├── features/clientes/
│   ├── state/       ← NGXS Store
│   └── pages/       ← Búsqueda cliente
└── shared/          ← Componentes comunes
```

---

## 📂 Estructura del Proyecto

```text
customer-management_talycap-global/
├── README.md
├── docker-compose.yml
├── LICENSE
├── scripts/
│   ├── init-db.sql
│   └── mssql-entrypoint.sh
├── backend/
│   ├── CustomerManagement.sln
│   ├── Dockerfile
│   └── src/
│       ├── Core/           ← Domain + Application
│       ├── Infrastructure/ ← EF Core + Repos
│       └── API/            ← Controllers + Swagger
└── frontend/
    ├── package.json
    ├── Dockerfile
    └── src/app/
        ├── core/
        ├── layout/
        ├── features/
        └── shared/
```

---

## ⚙️ Configuración

### Connection Strings

**Docker Compose:**

```text

Server=sqlserver,1433;Database=DBClientes;User Id=sa;Password=Customer__Management;TrustServerCertificate=True;Encrypt=False

```

**LocalDB (Windows):**

```text

Server=(localdb)\mssqllocaldb;Database=DBClientes;Integrated Security=true;TrustServerCertificate=True

```

### API URLs

**Desarrollo:** `http://localhost:5000/api`  
**Producción (Docker):** `http://api:8080/api`

---

## ✅ Checklist de Setup

- [ ] Docker Desktop corriendo (si usas Docker Compose)
- [ ] Repositorio clonado
- [ ] `docker-compose up --build` ejecutado
- [ ] Frontend accesible en <http://localhost>
- [ ] API Swagger disponible en <http://localhost:8080/index.html>
- [ ] Buscar cliente "1234567890" → ✓ Éxito
- [ ] Dark mode funciona (click en luna)
- [ ] Modal de detalle muestra datos correctamente

---

## 🔧 Solución de Problemas

**Puerto 1433 ya en uso:**

```bash
# Cambiar en docker-compose.yml
ports:
  - "1434:1433"
```

**"Cannot connect to Docker daemon":**

- Iniciar Docker Desktop

**Frontend no se conecta a API:**

- Verificar que API está corriendo: `curl http://localhost:8080/index.html`
- Verificar CORS en `backend/src/API/appsettings.json`

---

## 📝 Decisiones Clave

- ✓ **Signals**: Reactividad granular en Angular 20
- ✓ **NGXS**: State management centralizado
- ✓ **Clean Architecture**: Core → Infrastructure → API
- ✓ **Dark Mode**: CSS Variables + localStorage
- ✓ **Docker Compose**: Misma configuración dev ≈ prod

---

**Autor:** Cristian Bonilla  
**Licencia:** Ver [LICENSE](./LICENSE)

```text
         │
         ↓
┌────────────────────────────────────────┐
│ ClienteService (HttpClient)           │
│ GET /api/clientes/{identificacion}    │
└────────┬───────────────────────────────┘
         │
         ↓
    ┌────┴────┐
    │          │
    ↓          ↓
┌────────┐ ┌────────┐
│ 200 OK │ │ 404 / 5xx │
└───┬────┘ └────┬────┘
    │            │
    ↓            ↓
 Éxito      Error
(Modal)   (Toastr)

```

---

## 📝 Decisiones Técnicas Clave

### 1. Signals over RxJS Observables

**Por qué:**

- Reactividad granular y performante
- Mejor interoperabilidad con Angular 20
- Menor boilerplate en templates
- Debugging más sencillo

```typescript
// ✓ Signals
readonly cliente = signal<ClienteResponse | null>(null);

// vs. ✗ Observables en template
// async pipe puede causar memory leaks
```

### 2. NGXS vs. NgRx

**Por qué NGXS:**

- Sintaxis más limpia con decoradores
- Menos boilerplate
- Mejor performance en aplicaciones medianas
- Community muy activa

### 3. PrimeNG vs. Material

**Por qué PrimeNG:**

- Tema Aura con dark mode nativo
- Componentes más ricos (modales, toasts)
- Mejor accesibilidad (ARIA)
- Mejor soporte para dark mode

### 4. Arquitectura Hexagonal en .NET

**Beneficios:**

- Independencia de frameworks (EF Core, ASP.NET)
- Fácil testing sin mocks complejos
- Escalabilidad a largo plazo
- Claridad en capas

### 5. Docker Compose Multi-stage

**Beneficios:**

- Un comando para levantar toda la solución
- Replicación exacta de producción
- Volúmenes persistentes para datos
- Health checks automáticos

---

## 📄 Licencia

Ver archivo [LICENSE](./LICENSE) para más detalles.

---
