# Guía de Despliegue a Google Cloud Run

Esta guía te ayudará a subir tu aplicación (Frontend y Backend) a Google Cloud.

## Prerrequisitos

1. Tener una cuenta de Google Cloud con facturación habilitada.
2. Tener un proyecto creado en Google Cloud Console.

## Pasos

### 1. Inicialización

Abre tu terminal (PowerShell) y ejecuta:

```powershell
gcloud auth login
gcloud config set project [TU_ID_DE_PROYECTO]
```

### 2. Habilitar Servicios

Necesitamos habilitar Cloud Run y Container Registry (o Artifact Registry).

```powershell
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
```

### 3. Backend (API)

Primero desplegamos el backend para obtener su URL.

**Construir y subir imagen:**

```powershell
cd login-visionplus/backend
gcloud builds submit --tag gcr.io/[TU_ID_DE_PROYECTO]/visionplus-backend
```

**Desplegar en Cloud Run:**

```powershell
gcloud run deploy visionplus-backend --image gcr.io/[TU_ID_DE_PROYECTO]/visionplus-backend --platform managed --region us-central1 --allow-unauthenticated
```

*Anota la URL que te dará este comando (ej: <https://visionplus-backend-xyz.a.run.app>)*

### 4. Frontend (React)

Ahora desplegamos el frontend, configurando la URL del backend.

**Construir y subir imagen:**
Reemplaza `[URL_DEL_BACKEND]` con la URL que obtuviste en el paso anterior.

```powershell
cd ../frontend
gcloud builds submit --tag gcr.io/[TU_ID_DE_PROYECTO]/visionplus-frontend --substitutions=_VITE_API_URL=[URL_DEL_BACKEND]
```

*Nota: Para que esto funcione, necesitamos ajustar el cloudbuild.yaml o pasar el argumento de construcción.*

**Método alternativo (más simple para Dockerfile):**
Modifica el archivo `frontend/Dockerfile` antes de subirlo si es necesario, o usa argumentos de build.
Para Cloud Build directo:

```powershell
gcloud builds submit --tag gcr.io/[TU_ID_DE_PROYECTO]/visionplus-frontend --build-arg VITE_API_URL=[URL_DEL_BACKEND]
```

**Desplegar en Cloud Run:**

```powershell
gcloud run deploy visionplus-frontend --image gcr.io/[TU_ID_DE_PROYECTO]/visionplus-frontend --platform managed --region us-central1 --allow-unauthenticated
```

¡Listo! Tu frontend te dará una URL pública para acceder a la aplicación.
