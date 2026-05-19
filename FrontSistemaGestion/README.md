# Sistema de Gestión de Alquiler de Vehículos - Front-End

**Asignatura:** Desarrollo Web Full Stack

---

## Índice

1. [Introducción](#introducción)
2. [Componentes de React](#componentes-de-react)
3. [Hooks Utilizados](#hooks-utilizados)
4. [Vistas del Sistema](#vistas-del-sistema)
5. [Consumo de APIs REST](#consumo-de-apis-rest)
6. [Conclusiones](#conclusiones)

---

## Introducción

Este proyecto corresponde a la implementación del Front-End para un **Sistema de Gestión de Alquiler de Vehículos**. La plataforma tiene como objetivo principal permitir a los usuarios explorar un catálogo de vehículos, ver sus detalles y realizar solicitudes de alquiler, mientras que proporciona a los administradores una interfaz para gestionar la flota disponible.

**Enfoque del Desarrollo:**
El Front-End fue construido utilizando las tecnologías más modernas y robustas del ecosistema de JavaScript:
- **Librería Principal:** React 19 (mediante componentes funcionales modulares).
- **Entorno de Construcción:** Vite (con TypeScript para tipado estático y seguridad).
- **Estilos:** Tailwind CSS v4 para garantizar un diseño visual estético, premium y altamente responsivo (incluyendo efectos visuales como *Glassmorphism*).
- **Enrutamiento:** React Router DOM v6 para la gestión de navegación SPA (Single Page Application) fluida.
- **Cliente HTTP:** Axios para un consumo limpio y estructurado de las APIs del Back-End.

---

## Componentes de React

La aplicación fue desarrollada siguiendo un enfoque altamente modular, logrando más de 10 componentes funcionales reutilizables. Estos se dividen de la siguiente manera:

### Componentes de Estructura y Navegación
1. **`Layout`**: Actúa como contenedor envolvente de todas las páginas de la aplicación, integrando un Navbar superior, un Footer y renderizando las vistas hijas utilizando `<Outlet />`.
2. **`Navbar`**: Barra de navegación superior fija que contiene enlaces a las rutas principales ("Inicio", "Vehículos", "Admin").
3. **`Footer`**: Pie de página estético de la aplicación, incluyendo información de derechos y enlaces generales.

### Componentes de Interfaz de Usuario (UI Reutilizables)
4. **`Button`**: Componente de botón estilizado que acepta variantes (`primary`, `secondary`, `danger`, `outline`) y propiedades de ancho, centralizando la estética de botones en un solo lugar.
5. **`Badge`**: Etiqueta visual para indicar estados de los vehículos (ej. verde para "Disponible", rojo para "Alquilado").
6. **`LoadingSpinner`**: Componente visual que muestra una animación rotativa (spinner) mientras la información de la API es cargada, mejorando el UX.
7. **`ErrorMessage`**: Componente encargado de renderizar una alerta estructurada cuando ocurre un error de red o de sistema.

### Componentes de Negocio
8. **`VehicleCard`**: Una tarjeta visual (*card*) que muestra la fotografía, detalles (marca, modelo) y estado de un vehículo específico en el catálogo. Incluye un diseño tipo *hover-lift*.
9. **`VehicleForm`**: Formulario dinámico diseñado para la vista de Administrador. Sirve un doble propósito: recoger los datos para registrar un nuevo vehículo, o pre-cargar los datos para **editar y actualizar** la información de uno existente.
10. **`RentalForm`**: Formulario integrado en la vista de Detalles del Vehículo donde el usuario ingresa su nombre y fechas. Incluye una validación en tiempo real que consulta la API para bloquear el formulario si las fechas seleccionadas se superponen con un alquiler previamente registrado.

---

## Hooks Utilizados

El manejo del estado local, efectos secundarios y lógica de reactividad se gestionó utilizando Hooks estándar de React y Hooks proporcionados por React Router:

### Hooks Nativos
- **`useState`**: Empleado en los formularios (`VehicleForm`, `RentalForm`) para manejar el estado reactivo de los inputs controlados (nombres, fechas, etc.), y para gestionar estados de carga (`loading`) y errores (`error`). También usado en `Vehicles.tsx` para manejar el filtro por estado.
- **`useEffect`**: Utilizado para gatillar la obtención de datos inicial (como el detalle de un vehículo específico al cargar la página de detalles).
- **`useCallback`**: Utilizado para memorizar la función de recarga (*fetch*) en nuestro custom hook, evitando renders innecesarios.

### Hooks de Navegación
- **`useParams`**: Implementado en `VehicleDetails.tsx` para leer dinámicamente el `id` de la URL (`/vehiculos/:id`) y saber qué registro consultar a la API.
- **`useNavigate`**: Utilizado tras un alquiler exitoso en `RentalForm` para redirigir automáticamente al usuario de regreso a la galería de vehículos.

### Custom Hook: `useVehicles`
Se desarrolló un **Custom Hook** (`src/hooks/useVehicles.ts`) para abstraer y encapsular la compleja lógica de obtención del catálogo de vehículos. 
- **Funcionalidad**: Se encarga de hacer la petición a la API, inicializar el estado de la lista de vehículos, manejar explícitamente los estados asíncronos (`loading`, `error`) y exponer una función `refetch` para actualizar el catálogo cuando un nuevo vehículo es registrado. Esto reduce drásticamente el código repetitivo en la UI y centraliza la lógica de negocio.

---

## Vistas del Sistema

El sistema cuenta con 4 vistas principales (Rutas). *(Nota: Se ha preparado el espacio para adjuntar las capturas reales de ejecución)*:

### 1. Página Principal (Home)
Ruta: `/`
Una Landing Page moderna que actúa como carta de presentación, ofreciendo un gran "Hero Banner" con llamados a la acción, así como una sección detallando los beneficios del servicio.
![Captura de Pantalla - Inicio](./docs/screenshots/home.png)

### 2. Listado de Vehículos
Ruta: `/vehiculos`
Muestra el catálogo completo consumido desde el microservicio. Cuenta con la capacidad de filtrar por estado ("Todos", "Disponibles"). Renderiza múltiples `VehicleCard`.
![Captura de Pantalla - Listado de Vehículos](./docs/screenshots/listado.png)

### 3. Detalles de Vehículo
Ruta: `/vehiculos/:id`
Una vista detallada que muestra una foto grande y especificaciones de un auto específico. Si el estado es "DISPONIBLE", se muestra a la derecha el formulario de solicitud de alquiler (`RentalForm`); de lo contrario, alerta sobre su no disponibilidad.
![Captura de Pantalla - Detalles y Alquiler](./docs/screenshots/detalles.png)

### 4. Gestión Administrativa
Ruta: `/admin`
Un panel dividido en dos secciones para la gestión de flota: una pestaña muestra todo el inventario de vehículos en un formato de tabla limpio (con opción de **Editar** un vehículo en línea), y la otra pestaña renderiza el formulario inteligente para insertar o modificar registros de la base de datos.
![Captura de Pantalla - Admin Panel](./docs/screenshots/admin.png)

### 5. Historial de Solicitudes
Ruta: `/solicitudes`
Vista que lista todas las solicitudes de alquiler en una tabla moderna. Permite filtrar dinámicamente por un rango de fechas (con un rango predeterminado de 30 días hacia atrás y 30 días hacia adelante respecto a la fecha actual). Además, incluye botones de acción rápida para "Aprobar" o "Rechazar" aquellas solicitudes que se encuentren en estado PENDIENTE.
![Captura de Pantalla - Solicitudes](./docs/screenshots/solicitudes.png)

---

## Consumo de APIs REST

La integración con el **Back-End de Spring Boot (Microservicios)** se construyó de una forma desacoplada y libre de errores de política cruzada (CORS).

1. **Configuración de Proxy (Vite)**: Dado que el API Gateway del backend corre en `localhost:8080`, en lugar de hacer peticiones cruzadas, se configuró `vite.config.ts` para capturar cualquier petición hacia `/api` y redirigirla (Proxy) hacia el servidor de Spring Boot.
2. **Módulo de Servicios (Axios)**: Se creó un cliente base con **Axios** en `src/services/api.ts` con la URL base `/api`.
3. **Flujos Implementados**:
   - `GET /api/vehiculos`: Consulta y trae la lista de vehículos disponibles.
   - `GET /api/vehiculos/{id}`: Trae el detalle puntual para la vista de información.
   - `POST /api/vehiculos`: En el panel de administrador, registra un auto nuevo.
   - `PUT /api/vehiculos/{id}`: Permite actualizar (editar) la información de un auto existente desde el panel de administrador.
   - `PATCH /api/vehiculos/{id}/estado`: Para la actualización interna rápida.
   - `GET /api/operaciones/solicitudes`: Consulta el historial completo de todas las solicitudes de alquiler.
   - `GET /api/operaciones/solicitudes/vehiculo/{id}`: Consulta en tiempo real las solicitudes activas de un vehículo para validar si está ocupado en el calendario del Front-End.
   - `POST /api/operaciones/solicitudes`: El formulario de alquiler envía un JSON (*payload*) al microservicio de **Operaciones**, el cual internamente re-valida la superposición de fechas de la DB (ahora migrada a MySQL) y confirma la gestión de la renta exitosamente.
   - `PUT /api/operaciones/solicitudes/{id}/confirmar`: Acción del panel para aceptar una solicitud, marcándola como `APROBADO` y ocupando el vehículo.
   - `PUT /api/operaciones/solicitudes/{id}/cancelar`: Acción del panel para rechazar o anular una solicitud, marcándola como `RECHAZADO` y liberando el vehículo si corresponde.

---

## Conclusiones

La elaboración de este Front-End demuestra la potente sinergia entre React, Vite y herramientas modernas de CSS como Tailwind. Al dividir la interfaz en componentes altamente cohesivos y desacoplados y abstraer la lógica en un Custom Hook, el proyecto no solo es funcional y estéticamente superior, sino también altamente escalable. La integración transparente con la arquitectura de microservicios, lograda mediante un proxy seguro y el consumo por medio de Axios, culmina en un Sistema de Gestión de Alquiler de Vehículos robusto y listo para producción.
