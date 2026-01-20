# Documentación Técnica del Backend - VisionPlus

## Introducción y Filosofía del Desarrollo

Este documento describe cómo está construido el "cerebro" de VisionPlus. Para este proyecto, decidí utilizar **NestJS**. Aunque al principio la curva de aprendizaje con TypeScript y los decoradores fue algo retadora, elegí este framework porque ofrece una estructura muy ordenada (modular) que me ayuda a no perder el hilo conforme el proyecto crece. Es como tener todo en cajas perfectamente etiquetadas en lugar de tener código disperso por todos lados.

## Arquitectura General

El backend sigue una **Arquitectura Modular**. Esto significa que cada funcionalidad principal tiene su propia carpeta (Módulo) con todo lo necesario para funcionar:

- **Module**: El archivo que agrupa todo.
- **Controller**: El que recibe las peticiones HTTP (las rutas como `/login`, `/videos`).
- **Service**: Donde está la lógica real (la "magia" del código).
- **Schemas/Entities**: Como se ven los datos en la base de datos.

### Tecnologías Clave

- **Lenguaje**: TypeScript (JavaScript con superpoderes). Me ayuda a evitar errores tontos de tipos antes de correr el código.
- **Framework**: NestJS v10.
- **Base de Datos**: MongoDB (usando Mongoose). Elegí NoSQL porque los esquemas de videos y perfiles pueden cambiar y MongoDB es muy flexible.
- **Seguridad**: JWT (JSON Web Tokens) y Bcrypt para encriptar contraseñas.
- **Infraestructura**: Docker y Node.js Cluster para balanceo de carga.

---

## Análisis Detallado de Módulos

### 1. Módulo de Autenticación (`/auth`)

Este fue el primero que desarrollé y el más crítico.

- **Responsabilidad**: Manejar el registro, login y la validación de usuarios.
- **Funcionamiento**:
  - Cuando un usuario se loguea, genero un **Token JWT**.
  - Este token es como un "gafete" digital. El frontend debe enviarlo en cada petición para demostrar quién es.
  - Usé `Passport.js` para manejar las "Estrategias". Tengo una estrategia llamada `jwt.strategy` que verifica este token automáticamente.
- **Retos**: Configurar los Guards (los porteros de las rutas) para proteger endpoints específicos.

### 2. Módulo de Videos (`/videos`)

Aquí es donde ocurre la gestión del contenido multimedia.

- **Responsabilidad**: Gestionar la metadata de las películas/series y entregar las URLs de streaming.
- **Evolución Reciente**:
  - Originalmente solo entregaba archivos MP4 directos.
  - **Actualización Importante**: Implementé soporte para **HLS (HTTP Live Streaming)**. Esto permite que el video se cargue por "pedazos" (`.ts` chunks) en lugar de descargar un archivo gigante de golpe, similar a como lo hace Netflix.
  - Agregué una lógica de demos para que si no hay video real, se muestre un video de prueba (Big Buck Bunny) para no romper la UI.

### 3. Módulo de Perfiles (`/profiles`)

VisionPlus permite tener múltiples perfiles por cuenta (como "Papá", "Niños", etc.).

- **Lógica**: Un usuario (User) tiene una relación de uno a muchos con Perfiles (Profile).
- **Detalle**: Cada perfil tiene su propio "Avatar", "Lista" e "Historial".
- **Validación**: Me aseguré de que no puedas crear más de 5 perfiles para simular una restricción real de un plan básico.

### 4. Módulo de Películas (`/movies`)

- **Integración Externa**: Este módulo se conecta a la API de **TMDB (The Movie Database)**.
- **Por qué**: No tenía sentido crear una base de datos propia con miles de películas. Mejor consumo una API externa para obtener títulos, sinopsis e imágenes de alta calidad (posters/backdrops).
- **Cache (Pendiente)**: A futuro me gustaría agregar caché aquí para no hacer tantas peticiones externas.

### 5. Infraestructura y Balanceo de Carga (Nuevo)

Esta fue una de las partes más complejas y recientes.

- **Requerimiento**: El proyecto necesitaba correr en "2 servidores".
- **Solución Implementada**:
  - Creé un script `start-cluster.js` que levanta DOS instancias de la aplicación (en puertos 3001 y 3002).
  - Creé un **Balanceador de Carga** simple en Node.js (puerto 3000) que recibe el tráfico y lo reparte (`Round Robin`) entre las dos instancias.
  - **Beneficio**: Si un servidor se satura o cae, el otro puede seguir respondiendo (alta disponibilidad básica).

---

## Variables de Entorno (.env)

El proyecto utiliza un archivo `.env` para guardar secretos. Nunca subo esto al repositorio por seguridad.
Variables clave:

- `MONGO_URI`: La conexión a mi base de datos en MongoDB Atlas.
- `JWT_SECRET`: La "llave maestra" para firmar los tokens. Si alguien tiene esto, puede falsificar usuarios.
- `TMDB_API_KEY`: Mi llave para sacar datos de películas.

## Resumen del Flujo de Datos

1. El **Frontend** hace una petición (ej. `GET /videos/999`).
2. El **Balanceador** recibe la petición en puerto 3000.
3. Redirige la petición al **Servidor 1** (3001) o **Servidor 2** (3002).
4. El **Guard** (`JwtAuthGuard`) verifica si el usuario tiene permiso (si trae token válido).
5. El **Controller** recibe la petición y llama al **Service**.
6. El **Service** consulta a **MongoDB** (vía Mongoose) para buscar la información del video.
7. Si es un video HLS, devuelve la URL de la lista de reproducción (`.m3u8`).
8. La respuesta viaja de regreso al usuario.

---
*Documentación generada por el Líder Técnico del Proyecto VisionPlus.*
