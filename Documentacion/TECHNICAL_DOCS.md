# Documentación Técnica - VisionPlus

Esta documentación proporciona una visión general técnica del sistema "VisionPlus", cubriendo su arquitectura, APIs, despliegue, base de datos y mantenimiento.

## 1. Arquitectura del Sistema

El sistema sigue una arquitectura cliente-servidor moderna, separando el frontend (interfaz de usuario) del backend (lógica de negocio y datos).

### Componentes Principales

* **Frontend (Cliente)**: Desarrollado en **React** (versión 19) utilizando **Vite** como empaquetador. Se encarga de la presentación, navegación y reproducción de contenido.
  * *Stack*: React, React Router, Vite.
* **Backend (Servidor)**: Construido con **NestJS**, un framework progresivo de Node.js. Maneja la autenticación, gestión de usuarios, integración con servicios externos y lógica de negocio.
  * *Stack*: NestJS, Passport (Auth), Mongoose (ODM).
* **Base de Datos**: **MongoDB**, una base de datos NoSQL orientada a documentos, ideal para estructuras de datos flexibles como perfiles de usuario y catálogos de contenido.
* **Servicios Externos**:
  * **Bunny.net**: Utilizado para el almacenamiento y streaming de videos (CDN).
  * **TMDB (The Movie Database)**: Fuente de metadatos para información de películas y series.

### Diagrama de Flujo de Datos

1. El Usuario interactúa con la Interfaz (React).
2. El Frontend envía solicitudes HTTP al Backend (NestJS).
3. El Backend valida la solicitud (JWT Guard) y consulta la Base de Datos (MongoDB) o Servicios Externos (Bunny/TMDB).
4. El Backend devuelve la respuesta JSON al Frontend.

---

## 2. Documentación de las API's

El backend expone una API RESTful. A continuación se detallan los controladores principales y sus endpoints clave.

### Auth (`/auth`)

Encargado de la autenticación y gestión de sesiones.

* `POST /auth/login`: Iniciar sesión con email y contraseña.
* `POST /auth/register`: Registrar un nuevo usuario.
* `GET /auth/profile`: Obtener datos del usuario autenticado (requiere Token).
* `POST /auth/forgot-password`: Solicitar recuperación de contraseña.
* `POST /auth/reset-password`: Establecer nueva contraseña.

### Videos (`/videos`)

Gestión y reproducción de contenido.

* `GET /videos/:id/stream`: Obtiene la URL de streaming para un video específico (Soporta parámetros `season` y `episode`).
* `GET /videos/details/:id`: Obtiene detalles técnicos de un video.
* `POST /videos/map`: (Admin) Asocia un ID de TMDB con un ID de video de Bunny.net. Requiere header `x-admin-secret`.
* `GET /videos/mapped`: Lista todos los videos mapeados en el sistema.
* `GET /videos/demos`: Lista videos de demostración.

### Profiles (`/profiles`)

Gestión de perfiles de usuario (similar a Netflix).

* `GET /profiles`: Obtener todos los perfiles del usuario logueado.
* `POST /profiles`: Crear un nuevo perfil.
* `GET /profiles/:id`: Obtener un perfil específico.
* `PUT /profiles/:id`: Actualizar un perfil.
* `DELETE /profiles/:id`: Eliminar un perfil.

### Otros Controladores

* **Movies (`/movies`)**: Búsqueda y listado de películas desde TMDB.
* **Lists (`/lists`)**: Gestión de "Mi Lista" y Favoritos.
* **History (`/history`)**: Registro y consulta del historial de visualización.
* **Subscriptions (`/subscriptions`)**: Gestión de planes y pagos.

---

## 3. Guía de Despliegue

### Requisitos Previos

* Node.js v20+
* MongoDB Instance (ej. MongoDB Atlas)
* Cuenta en Bunny.net y Clave API de TMDB.

### Variables de Entorno (.env)

Configura las siguientes variables en tu entorno de producción (o archivo `.env` local):

```env
# Base de Datos
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/visionplus

# Seguridad
JWT_SECRET=tu_secreto_super_seguro
ADMIN_SECRET=visionplus_admin

# Servicios Externos
TMDB_API_KEY=tu_api_key_de_tmdb
BUNNY_API_KEY=tu_api_key_de_bunny
```

### Despliegue con Docker

#### Backend

El proyecto incluye un `Dockerfile` optimizado (multi-stage).

```bash
cd backend
# Construir imagen
docker build -t visionplus-backend .
# Correr contenedor
docker run -p 3000:3000 --env-file .env visionplus-backend
```

#### Frontend

El frontend también incluye `Dockerfile` que sirve el build estático con Nginx.

```bash
cd frontend
# Construir imagen
docker build -t visionplus-frontend .
# Correr contenedor
docker run -p 8080:8080 visionplus-frontend
```

---

## 4. Documentación de BD

La base de datos utiliza MongoDB. A continuación se describen los esquemas principales (Collections).

### Users (`users`)

Almacena las credenciales de acceso de la cuenta principal.

* `email`: String (Único, Requerido)
* `password`: String (Hashed)
* `resetToken`: String (Opcional, para recuperación)

### Profiles (`profiles`)

Perfiles individuales bajo una cuenta de usuario.

* `userId`: ObjectId (Referencia a User)
* `name`: String
* `avatar`: String (URL o ID de imagen)
* `settings`: Object (Configuraciones de perfil)

### Videos (`videos`)

Mapa de conexión entre TMDB y Bunny.net.

* `tmdbId`: Number (ID en The Movie Database) - Indexado.
* `bunnyVideoId`: String (ID del video en Bunny.net).
* `libraryId`: String (ID de la librería en Bunny.net).
* `title`: String (Título descriptivo).
* `type`: String ('movie' | 'tv').
* `season`: Number (Opcional, para series).
* `episode`: Number (Opcional, para series).

### Subscriptions (`subscriptions`)

Estado de la suscripción del usuario.

* `userId`: ObjectId
* `plan`: String ('basic', 'standard', 'premium')
* `status`: String ('active', 'inactive')
* `endDate`: Date

---

## 5. Guía de Mantenimiento

### Comandos de Desarrollo

Ejecutar desde las carpetas respectivas (`backend/` o `frontend/`).

* **Iniciar Desarrollo**:
  * Backend: `npm run start:dev` (Reinicia al detectar cambios)
  * Frontend: `npm run dev` (Servidor Vite)
* **Construir Producción**:
  * Backend: `npm run build` (Genera carpeta `dist/`)
  * Frontend: `npm run build` (Genera carpeta `dist/` estática)
* **Linting/Formato**:
  * `npm run lint` (Verificar estilo de código)
  * `npm run format` (Formatear código con Prettier)

### Monitoreo

* **Logs**: El backend utiliza el sistema de logging de NestJS. En producción, revisar la salida estándar (`stdout`) del contenedor.
* **Estado de Servicios**:
  * Verificar conexión a MongoDB si hay errores de timeout.
  * Verificar cuotas de TMDB si las imágenes no cargan.

### Prácticas Recomendadas

1. **Backups**: Configurar backups automáticos diarios en MongoDB Atlas.
2. **Seguridad**: Rotar `JWT_SECRET` y `ADMIN_SECRET` periódicamente.
3. **Actualizaciones**: Mantener dependencias actualizadas (`npm update`) probando en entorno de desarrollo primero.
