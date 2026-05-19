# 🚗 Sistema de Gestión de Alquiler de Vehículos

Sistema basado en **arquitectura de microservicios** desarrollado con **Spring Boot 4.0.6** y **Spring Cloud 2025.1.1**, diseñado para gestionar el alquiler de vehículos. El sistema implementa descubrimiento de servicios con **Eureka**, enrutamiento centralizado con **API Gateway** y comunicación entre microservicios mediante **RestTemplate** con balanceo de carga.

---

## 📋 Tabla de Contenidos

- [Arquitectura](#-arquitectura)
- [Componentes y Microservicios](#-componentes-y-microservicios)
  - [Eureka Server](#1-eureka-server)
  - [API Gateway](#2-api-gateway)
  - [Vehículos](#3-microservicio-vehículos)
  - [Operaciones](#4-microservicio-operaciones)
  - [Frontend (React)](#5-frontend-react)
- [Endpoints - Vehículos](#-endpoints---vehículos)
- [Endpoints - Operaciones](#-endpoints---operaciones)
- [Inicio con Docker Compose](#-inicio-con-docker-compose)
- [Inicio Manual (sin Docker)](#-inicio-manual-sin-docker)

---

## 🏗 Arquitectura

```
                         ┌──────────────────┐
                         │   Eureka Server   │
                         │     :8761         │
                         └────────┬─────────┘
                                  │ Registro y
                                  │ Descubrimiento
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
┌─────────▼────────┐   ┌─────────▼────────┐   ┌──────────▼───────┐
│   API Gateway     │   │   Vehículos       │   │   Operaciones     │
│     :8080         │   │     :8081         │   │     :8082         │
│                   │   │                   │   │                   │
│ Enruta peticiones │   │ CRUD Vehículos    │   │ Solicitudes de    │
│ a los servicios   │   │ MySQL             │   │ alquiler (MySQL)  │
└─────────▲─────────┘   └─────────┬─────────┘   └──────────┬───────┘
          │                       │                        │
          │ Proxy Nginx           ┌────────▼─────────┐              │
┌─────────▼────────┐              │     MySQL 8.0     │◄─────────────┘
│   Frontend        │              │   BD: gestion     │  (consulta vehículos
│   (React + Vite)  │              │     :3306         │   via REST + Eureka)
│     :80           │              └──────────────────┘
└───────────────────┘
```

| Componente     | Puerto | Tecnología                          |
|----------------|--------|-------------------------------------|
| Frontend       | 80     | React 19 + Vite + Tailwind + Nginx  |
| Eureka Server  | 8761   | Spring Cloud Netflix Eureka         |
| API Gateway    | 8080   | Spring Cloud Gateway (WebFlux)      |
| Vehículos      | 8081   | Spring Boot + JPA + MySQL           |
| Operaciones    | 8082   | Spring Boot + JPA + MySQL           |
| MySQL          | 3306   | MySQL 8.0                           |

---

## 🔧 Componentes y Microservicios

### 1. Eureka Server

**Directorio:** `eureka/` | **Puerto:** `8761`

Servidor de descubrimiento de servicios. Todos los microservicios se registran en Eureka al iniciar, permitiendo que se descubran entre sí por nombre lógico en lugar de IPs hardcodeadas.

- **Dashboard:** [http://localhost:8761](http://localhost:8761)
- No se registra a sí mismo (`register-with-eureka=false`)

---

### 2. API Gateway

**Directorio:** `gateway/` | **Puerto:** `8080`

Punto de entrada único para todas las peticiones del cliente. Actúa como proxy inverso y balanceador de carga, redirigiendo las peticiones al microservicio correspondiente a través de Eureka.

| Ruta                          | Servicio destino |
|-------------------------------|------------------|
| `/api/vehiculos/**`           | VEHICULOS        |
| `/api/operaciones/**`         | OPERACIONES      |

> **Nota:** Todas las peticiones a los microservicios deben realizarse a través del Gateway en el puerto `8080`.

---

### 3. Microservicio Vehículos

**Directorio:** `vehiculos/` | **Puerto:** `8081`

Gestiona el CRUD completo de vehículos. Persiste los datos en una base de datos **MySQL** (`gestion`). Cada vehículo tiene los campos: placa, marca, modelo, color y estado (activo/inactivo).

---

### 4. Microservicio Operaciones

**Directorio:** `operaciones/` | **Puerto:** `8082`

Gestiona las solicitudes de alquiler de vehículos. Utiliza **MySQL** para almacenar las solicitudes persistentes (la tabla de `solicitudes` se crea en la misma base de datos `gestion`). Se comunica con el microservicio de **Vehículos** a través de **RestTemplate con balanceo de carga** (Eureka) para validar la disponibilidad y actualizar el estado del vehículo.

**Flujo de una solicitud:**
1. El cliente crea una solicitud de alquiler (estado `PENDIENTE`)
2. Se valida que el vehículo exista y esté disponible consultando al microservicio Vehículos
3. Al confirmar, el estado del vehículo se actualiza a inactivo
4. Al cancelar, el vehículo vuelve a estar disponible

---

### 5. Frontend (React)

**Directorio:** `FrontSistemaGestion/` | **Puerto:** `80`

Aplicación Single Page (SPA) moderna desarrollada con **React 19**, **Vite** y **Tailwind CSS**.
Al estar contenerizada en Docker, es servida por un servidor web estático y veloz **Nginx**. Este servidor web incluye una configuración de Proxy Reverso (Reverse Proxy) interna que permite enrutar automáticamente cualquier llamada hacia la ruta `/api/` directamente al contenedor del **API Gateway (`gateway:8080`)**, eliminando de esta forma cualquier problema de red o CORS en producción.

---

## 📡 Endpoints - Vehículos

**Base URL:** `http://localhost:8080/api/vehiculos`

### Obtener todos los vehículos

```http
GET /api/vehiculos
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "placa": "ABC-1234",
    "marca": "Toyota",
    "modelo": "Corolla",
    "color": "Blanco",
    "estado": true,
    "fechaRegistro": "2026-05-10T00:00:00",
    "fechaActualizacion": "2026-05-10T00:00:00"
  }
]
```

### Obtener un vehículo por ID

```http
GET /api/vehiculos/1
```

### Crear un vehículo

```http
POST /api/vehiculos
Content-Type: application/json

{
  "placa": "XYZ-5678",
  "marca": "Honda",
  "modelo": "Civic",
  "color": "Negro",
  "estado": true
}
```

**Respuesta:** `201 Created`
```json
{
  "id": 2,
  "placa": "XYZ-5678",
  "marca": "Honda",
  "modelo": "Civic",
  "color": "Negro",
  "estado": true,
  "fechaRegistro": "2026-05-10T01:30:00",
  "fechaActualizacion": "2026-05-10T01:30:00"
}
```

### Actualizar un vehículo

```http
PUT /api/vehiculos/1
Content-Type: application/json

{
  "placa": "ABC-1234",
  "marca": "Toyota",
  "modelo": "Corolla",
  "color": "Rojo",
  "estado": true
}
```

### Eliminar un vehículo

```http
DELETE /api/vehiculos/1
```

**Respuesta:** `204 No Content`

### Buscar vehículos (por marca, modelo o estado)

```http
GET /api/vehiculos/buscar?marca=Toyota
GET /api/vehiculos/buscar?modelo=Corolla
GET /api/vehiculos/buscar?estado=true
```

---

## 📡 Endpoints - Operaciones

**Base URL:** `http://localhost:8080/api/operaciones/solicitudes`

### Obtener todas las solicitudes

```http
GET /api/operaciones/solicitudes
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "vehiculoId": 1,
    "clienteNombre": "Juan Pérez",
    "fechaInicio": "2026-05-15",
    "fechaFin": "2026-05-20",
    "estadoSolicitud": "PENDIENTE",
    "fechaRegistro": "2026-05-10T01:00:00",
    "fechaActualizacion": "2026-05-10T01:00:00"
  }
]
```

### Obtener una solicitud por ID

```http
GET /api/operaciones/solicitudes/1
```

### Registrar una solicitud de alquiler

```http
POST /api/operaciones/solicitudes
Content-Type: application/json

{
  "vehiculoId": 1,
  "clienteNombre": "Juan Pérez",
  "fechaInicio": "2026-05-15",
  "fechaFin": "2026-05-20"
}
```

**Respuesta:** `201 Created`
```json
{
  "id": 1,
  "vehiculoId": 1,
  "clienteNombre": "Juan Pérez",
  "fechaInicio": "2026-05-15",
  "fechaFin": "2026-05-20",
  "estadoSolicitud": "PENDIENTE",
  "fechaRegistro": "2026-05-10T01:00:00",
  "fechaActualizacion": "2026-05-10T01:00:00"
}
```

### Confirmar un alquiler

Cambia el estado de la solicitud a `CONFIRMADA` y marca el vehículo como no disponible (`estado: false`).

```http
PUT /api/operaciones/solicitudes/1/confirmar
```

### Cancelar una solicitud

Cambia el estado de la solicitud a `CANCELADA` y libera el vehículo (`estado: true`).

```http
PUT /api/operaciones/solicitudes/1/cancelar
```

---

## 🐳 Inicio con Docker Compose

### Requisitos previos

- [Docker](https://www.docker.com/) instalado
- [Docker Compose](https://docs.docker.com/compose/) instalado

### Levantar todo el sistema

Desde la raíz del proyecto (`gestion-vehiculos/`):

```bash
docker-compose up --build
```

Esto construirá las imágenes y levantará los 5 contenedores en el orden correcto:

1. **mysql-db** → Se inicia primero y ejecuta `init.sql` para crear las tablas
2. **eureka-server** → Se inicia y espera a estar saludable
3. **vehiculos** → Espera a que MySQL y Eureka estén listos
4. **operaciones** → Espera a que Eureka esté listo
5. **gateway** → Espera a que Eureka esté listo

### Verificar que todo está corriendo

```bash
docker-compose ps
```

| Contenedor     | URL                                       |
|----------------|-------------------------------------------|
| Eureka         | [http://localhost:8761](http://localhost:8761) |
| Gateway        | [http://localhost:8080](http://localhost:8080) |
| Vehículos      | [http://localhost:8080/api/vehiculos](http://localhost:8080/api/vehiculos) |
| Operaciones    | [http://localhost:8080/api/operaciones/solicitudes](http://localhost:8080/api/operaciones/solicitudes) |

### Detener los contenedores

```bash
docker-compose down
```

### Reconstruir sin caché (si hay cambios en el código)

```bash
docker-compose down
docker-compose up --build --force-recreate
```

### Persistencia de datos (MySQL)

Los datos de MySQL se almacenan en un **volumen Docker** llamado `mysql_data`, lo que garantiza que la información de la base de datos **se conserve** entre reinicios y reconstrucciones de contenedores.

- `docker-compose down` → **conserva** los datos
- `docker-compose down -v` → **elimina** los datos (borra el volumen)

Para verificar el volumen:

```bash
docker volume ls
```

---

## 🖥 Inicio Manual (sin Docker)

Si prefieres ejecutar los servicios de forma local, necesitas tener **Java 25** y **MySQL 8.0** corriendo en `localhost:3306`.

Abrir una terminal separada para cada servicio y ejecutar **en este orden**:

**1. Iniciar MySQL** (debe estar corriendo con la BD `gestion` creada)

**2. Eureka Server:**
```bash
cd eureka
.\mvnw spring-boot:run
```

**3. Vehículos:**
```bash
cd vehiculos
.\mvnw spring-boot:run
```

**4. Operaciones:**
```bash
cd operaciones
.\mvnw spring-boot:run
```

**5. Gateway:**
```bash
cd gateway
.\mvnw spring-boot:run
```

---

## 🛠 Tecnologías

- **Java 25**
- **Spring Boot 4.0.6**
- **Spring Cloud 2025.1.1**
- **Spring Cloud Gateway (WebFlux)**
- **Spring Cloud Netflix Eureka**
- **Spring Cloud LoadBalancer**
- **Spring Data JPA**
- **MySQL 8.0**
- **H2 Database** (en memoria)
- **Lombok**
- **Docker & Docker Compose**
