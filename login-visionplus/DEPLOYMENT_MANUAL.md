# Manual de Instalación y Despliegue - VisionPlus

Este documento explica cómo echar a andar el proyecto desde cero, ya sea en tu computadora (Local), usando contenedores (Docker), o **en la Nube (Internet)**.

## 1. Instalación Local (Paso a Paso)

Ideal para desarrollar y probar cambios rápidamente.

### Paso A: Clonar el Proyecto

Descarga la carpeta del proyecto a tu escritorio o documento.

### Paso B: Configurar el Backend

1. Abre una terminal en la carpeta `backend`.
2. Crea un archivo `.env` con tus credenciales (Mongo, JWT, etc.).
3. Instala y corre:

    ```bash
    npm install
    node start-cluster.js
    ```

### Paso C: Configurar el Frontend

1. Abre una terminal en `frontend`.
2. Instala y corre:

    ```bash
    npm install
    npm run dev
    ```

---

## 2. Despliegue con Docker (Cluster Local)

Para correr todo el sistema (Backend Cluster + Frontend) en tu máquina sin instalar Node.js por separado.

1. Asegúrate de que **Docker Desktop** esté corriendo.
2. Ejecuta el script de despliegue en la raíz:

    ```powershell
    ./deploy.ps1
    ```

3. Accede a: `http://localhost:8080`.

---

## 3. Despliegue en la Nube (WEB PÚBLICA)

Para que cualquier persona pueda ver tu proyecto desde su casa.

**Repositorio del Proyecto**: [GitHub: VisionPlus-Final](https://github.com/LUIGUI55/VisionPlus-Final)

Recomiendo usar **Railway** (railway.app) porque detecta automáticamente nuestra configuración Docker.

### Paso 1: Crear Servicios en Railway

1. Entra a Railway y selecciona "New Project" -> "Deploy from GitHub repo".
2. Selecciona tu repositorio `VisionPlus-Final`.

### Paso 2: Configurar Backend

1. Agrega un servicio conectado al repo.
2. En **Settings** -> **Root Directory**, escribe: `/backend`.
3. En **Variables**, agrega tus secretos: `MONGO_URI`, `JWT_SECRET`, `TMDB_API_KEY`.
4. Railway detectará el `Dockerfile` y levantará el Cluster.
5. Railway te dará una URL (ej. `https://backend-production.up.railway.app`).

### Paso 3: Configurar Frontend

1. Agrega otro servicio conectado al mismo repo.
2. En **Settings** -> **Root Directory**, escribe: `/frontend`.
3. En **Variables**, agrega:
    `VITE_API_URL` = `https://backend-production.up.railway.app` (La URL que obtuviste en el paso anterior).
4. Railway desplegará el frontend y te dará tu URL final (ej. `https://visionplus.up.railway.app`).

¡Listo! Comparte esa última URL con tu profesor.

---
*Hecho para el proyecto final de Ingeniería de Software.*
