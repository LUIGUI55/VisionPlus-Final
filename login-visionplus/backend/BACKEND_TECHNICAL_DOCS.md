# 📘 Documentación Técnica del Backend - VisionPlus

## 1. Introducción
VisionPlus es una plataforma de streaming de video construida con una arquitectura robusta y escalable utilizando **NestJS**. Este backend proporciona una API RESTful completa para gestionar autenticación, usuarios, perfiles, catálogos de películas (vía TMDB), listas de reproducción, historial de visualización y suscripciones.

### Tecnologías Principales
-   **Framework**: NestJS (Node.js)
-   **Lenguaje**: TypeScript
-   **Base de Datos**: SQLite (vía TypeORM)
-   **Autenticación**: JWT (JSON Web Tokens) & Bcrypt
-   **Integraciones**: The Movie Database (TMDB) API

---

## 2. Instalación y Configuración

### Prerrequisitos
-   Node.js (v16 o superior)
-   npm o yarn

### Pasos de Instalación
1.  Clonar el repositorio.
2.  Instalar dependencias:
    ```bash
    npm install
    ```
3.  Configurar variables de entorno. Crear un archivo `.env` en la raíz basado en `.env.example`:
    ```env
    TMDB_API_KEY=tu_api_key_de_tmdb
    JWT_SECRET=tu_secreto_super_seguro
    ```
4.  Iniciar el servidor en modo desarrollo:
    ```bash
    npm run start:dev
    ```

---

## 3. Arquitectura del Proyecto

El proyecto sigue la arquitectura modular de NestJS, donde cada dominio de negocio está encapsulado en su propio módulo.

### Estructura de Directorios (`src/`)
-   `auth/`: Módulo de autenticación y seguridad.
-   `users/`: Gestión de usuarios y entidad principal.
-   `profiles/`: Gestión de perfiles de visualización (hasta 5 por usuario).
-   `movies/`: Servicio de integración con TMDB para catálogo.
-   `lists/`: Gestión de "Mi Lista" y "Favoritos".
-   `history/`: Seguimiento de progreso de visualización.
-   `subscriptions/`: Gestión de planes y pagos.
-   `videos/`: Servicio de streaming (URLs de demostración).

---

## 4. Esquema de Base de Datos (ERD)

El sistema utiliza **TypeORM** con **SQLite**. A continuación se describen las entidades principales y sus relaciones:

### **User**
Representa la cuenta principal de facturación.
-   `id`: PK, Auto-incremental.
-   `email`: Unique, String.
-   `password`: String (Hashed).
-   **Relaciones**: OneToMany con `Profile`, `Subscription`, `Payment`.

### **Profile**
Perfiles de visualización asociados a una cuenta.
-   `id`: PK.
-   `name`: String.
-   `avatar`: String (URL o Path).
-   `userId`: FK -> User.
-   **Relaciones**: OneToMany con `Favorite`, `Watchlist`, `WatchHistory`.

### **Subscription**
Estado de la suscripción del usuario.
-   `id`: PK.
-   `planType`: Enum (BASIC, PREMIUM).
-   `status`: Enum (ACTIVE, EXPIRED).
-   `startDate` / `endDate`: Date.
-   `userId`: FK -> User.

### **Payment**
Registro histórico de transacciones.
-   `id`: PK.
-   `amount`: Decimal.
-   `status`: String.
-   `userId`: FK -> User.

### **WatchHistory**
Progreso de visualización de contenido.
-   `id`: PK.
-   `movieId`: Integer (ID de TMDB).
-   `progress`: Integer (segundos vistos).
-   `duration`: Integer (duración total).
-   `profileId`: FK -> Profile.

---

## 5. Referencia de Módulos y API

###  Módulo de Autenticación (`AuthModule`)
Maneja el ciclo de vida de la sesión del usuario utilizando estrategias Passport y JWT.

-   **POST /auth/login**: Valida credenciales y retorna `access_token`.
-   **POST /auth/register**: Crea una nueva cuenta de usuario.
-   **POST /auth/forgot-password**: Genera token de recuperación.
-   **POST /auth/reset-password**: Restablece contraseña con token válido.
-   **Guards**: `JwtAuthGuard` protege rutas privadas verificando el header `Authorization: Bearer <token>`.

###  Módulo de Perfiles (`ProfilesModule`)
Permite la personalización de la experiencia de usuario.
-   **Lógica de Negocio**: Implementa una restricción estricta de **máximo 5 perfiles** por cuenta de usuario (`profiles.service.ts`).
-   **Endpoints**: CRUD completo para perfiles (`GET`, `POST`, `PATCH`, `DELETE`).

###  Módulo de Películas (`MoviesModule`)
Actúa como un proxy/gateway hacia la API de TMDB.
-   **Servicio**: `MoviesService` encapsula las llamadas HTTP a TMDB usando `axios`.
-   **Funcionalidades**:
    -   `getPopularMovies()`: Películas populares.
    -   `searchMovies(query)`: Búsqueda por texto.
    -   `getMovieDetails(id)`: Metadatos completos.
    -   Soporte para Series de TV y Anime (filtrado por género de animación y origen JP).

### Módulo de Listas (`ListsModule`)
Gestiona las colecciones personales del usuario.
-   **Favoritos**: Lista de "Me gusta".
-   **Watchlist**: Lista de "Ver más tarde".
-   **Almacenamiento**: Guarda una copia ligera de los metadatos de la película (`movieData`) para evitar consultas excesivas a TMDB al listar.

### Módulo de Historial (`HistoryModule`)
Permite la funcionalidad de "Continuar viendo".
-   **Endpoint**: `POST /history` guarda el progreso actual.
-   **Lógica**: Si ya existe un registro para esa película/perfil, actualiza el progreso y la fecha `lastWatchedAt`; si no, crea uno nuevo.

### Módulo de Suscripciones (`SubscriptionsModule`)
Sistema simplificado de gestión de planes.
-   **Planes**: Básico y Premium.
-   **Pagos**: Simulación de procesamiento de pagos (Mock). Genera registros de `Payment` exitosos automáticamente para fines de demostración.
-   **Validación**: Permite consultar el estado actual de la suscripción para restringir acceso a contenido.

---

## 6. Seguridad y Rendimiento

### Seguridad
-   **Hashing**: Todas las contraseñas se hashean con `bcrypt` (salt rounds: 10).
-   **JWT**: Tokens firmados con expiración configurable.
-   **CORS**: Configurado para permitir peticiones desde el frontend.

### Rendimiento
-   **Throttling**: Implementado `ThrottlerModule` para limitar la tasa de peticiones (Rate Limiting) y prevenir ataques de fuerza bruta (10 reqs/min por defecto).

---

## 7. Despliegue y Compilación

El proyecto utiliza el compilador de TypeScript (`tsc`) a través de Nest CLI.

### Proceso de Build
El comando `npm run build` genera la carpeta `dist/`.
-   **src/**: Código fuente TypeScript (Desarrollo).
-   **dist/**: Código JavaScript compilado y optimizado (Producción).

### Ejecución en Producción
```bash
npm run build
npm run start:prod
```
**Nota**: Asegúrese de que las variables de entorno estén configuradas en el servidor de producción.

---

## 8. Mantenimiento y Extensibilidad

Para agregar nuevas funcionalidades:
1.  Generar nuevo módulo: `nest g module <nombre>`
2.  Generar controlador y servicio: `nest g controller <nombre>`, `nest g service <nombre>`
3.  Registrar en `app.module.ts` (automático con CLI).
4.  Si requiere base de datos, crear entidad en `<nombre>/entities/` y registrarla en `TypeOrmModule.forRoot`.

---
*Generado automáticamente por Asistente de Desarrollo - 2025*
