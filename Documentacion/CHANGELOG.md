# Registro de Cambios - VisionPlus DevLog

Este documento rastrea la evolución del proyecto desde su inicio hasta la versión actual entregable.

## [v1.2.0] - Implementación Final de Arquitectura (Actual)

**Fecha**: 16 de Enero, 2026
**Enfoque**: Infraestructura y Streaming avanzado (Feedback del Profesor).

### Nuevas Características

- **Streaming HLS**: Se implementó la reproducción de video por segmentos (`.m3u8`) usando la librería `hls.js` en el frontend y configuración de archivos estáticos en backend.
- **Balanceo de Carga**: Se creó una arquitectura de cluster simulada.
  - Script `start-cluster.js` que levanta 2 instancias del backend y 1 balanceador.
  - Balanceador de carga propio (Node.js) con estrategia Round-Robin.
- **Contenerización Avanzada**:
  - `Docker-compose` configurado para orquestar todo el sistema.
  - Backend Dockerfile modificado para operar en modo Cluster automáticamente.

### Correcciones

- Se corrigió un error de sintaxis en `VideoPlayer.jsx` que impedía la compilación.
- Se solucionaron conflictos de dependencias (`peer-deps`) al instalar NestJS Serve Static.
- **Hotfix Despliegue**: Se ajustó la configuración de Vite (`base: './'`) y el `Dockerfile` del frontend para resolver correctamente las rutas en entornos Linux/Cloud.

---

## [v1.1.0] - Gestión de Contenido y Perfiles

**Fecha**: 10 de Enero, 2026
**Enfoque**: Funcionalidad Core de Streaming.

### Características

- **Integración con TMDB**: Conexión exitosa a la API externa para obtener posters y datos de películas.
- **Mapeo de Videos**: Creación de la colección `videos` en MongoDB para enlazar IDs de TMDB con archivos reales.
- **Gestión de Perfiles**:
  - Lógica para crear hasta 5 perfiles por cuenta.
  - Selección de avatares.
  - Endpoint para "Mi Lista" por perfil.

---

## [v1.0.0] - Autenticación y Base

**Fecha**: Diciembre, 2025
**Enfoque**: Seguridad y Estructura.

### Características

- **Backend Setup**: Inicialización del proyecto con NestJS.
- **Base de Datos**: Configuración de conexión con MongoDB Atlas.
- **Sistema de Auth**:
  - Registro de usuarios (hash de contraseñas con Bcrypt).
  - Login y generación de JWT.
  - Guards para proteger rutas privadas.
- **Frontend Inicial**:
  - Maquetado de Login y Register con React + TailwindCSS.
  - Configuración de Rutas con React Router.

---

## Versiones Alpha / Prototipos

- **v0.5**: Pruebas iniciales con SQLite (descartado por MongoDB).
- **v0.2**: Maquetado estático en HTML/CSS para validar diseño.

---
*Este changelog se mantiene actualizado con cada iteración significativa del proyecto.*
