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

### Paso 1: Configurar Servicios en Railway (Esquema Monorepo)

Como tu proyecto tiene Backend y Frontend en la misma carpeta, necesitas crear **DOS** servicios separados en Railway:

1. **Servicio Backend**:
    - Conecta tu repo.
    - Ve a **Settings -> Root Directory**.
    - Escribe: `/backend`.
    - En **Variables**: Agrega `MONGO_URI`, `JWT_SECRET`, `TMDB_API_KEY`.
    - *Este servicio te dará una URL pública (ej. <https://tu-backend.up.railway.app>)*.

2. **Servicio Frontend**:
    - Vuelve al Dashboard y crea un **Nuevo Servicio** conectando el **MISMO repo**.
    - Ve a **Settings -> Root Directory**.
    - Escribe: `/frontend`.
    - Ve a **Variables** y agrega:
      - `VITE_API_URL`: Pega aquí la dirección pública de tu Backend (Ej. `https://tu-backend.up.railway.app`).
    - Railway detectará tu configuración y desplegará la web.

¡Listo! Comparte esa última URL con tu profesor.

---
*Hecho para el proyecto final de Ingeniería de Software.*
