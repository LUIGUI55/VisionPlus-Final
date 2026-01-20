# Documentación Técnica del Proyecto: Arquitectura y Despliegue

Este documento detalla los aspectos técnicos profundos del backend, la estrategia de containerización y el flujo de despliegue. Diseñado para responder preguntas estrictas sobre la ingeniería del sistema.

## 1. Arquitectura del Backend: Clustering Manual

A diferencia de una aplicación estándar de Node.js que corre en un solo hilo (single-threaded), este proyecto implementa una **arquitectura de alta disponibilidad simulada** mediante un clúster de aplicación personalizado.

### Tecnologías Core

- **Framework**: NestJS (Modularidad, Inyección de Dependencias, TypeScript).
- **Base de Datos**: MongoDB (NoSQL) conectado vía Mongoose ODM.
- **Seguridad**: JWT (JSON Web Tokens) y Passport para autenticación de "Guards".

### Estrategia de Clustering y Balanceo de Carga

El backend no expone directamente la aplicación NestJS al usuario. En su lugar, utiliza una arquitectura de tres capas internas:

1. **Orquestador (`start-cluster.js`)**:
    - Es el punto de entrada (`entrypoint`) del contenedor.
    - Utiliza el módulo nativo `child_process` de Node.js.
    - **Función**: Spawnea (engendra) dos procesos independientes de la aplicación NestJS.
        - **Instancia 1**: Corre en el puerto interno `3001`.
        - **Instancia 2**: Corre en el puerto interno `3002`.
    - Esto permite que la aplicación utilice mejor los recursos del sistema y simula un entorno de microservicios o escalado horizontal.

2. **Balanceador de Carga de Capa de Aplicación (`load-balancer.js`)**:
    - Es un script de Node.js puro (o con dependencias mínimas como `http-proxy`) que corre frente a las instancias.
    - **Puerto Expuesto**: Escucha en el puerto `3000` (el único accesible públicamente).
    - **Algoritmo Round-Robin**: Distribuye el tráfico entrante de manera secuencial y equitativa:
        - Petición 1 -> Instancia 3001
        - Petición 2 -> Instancia 3002
        - Petición 3 -> Instancia 3001
    - **Resiliencia**: Si una instancia cae momentáneamente, el balanceador puede (dependiendo de la implementación avanzada) redirigir el tráfico, aunque su función principal en este proyecto es la distribución de carga.

---

## 2. Containerización con Docker

Docker encapsula la aplicación y todas sus dependencias (node_modules, configuraciones de OS) en una unidad estandarizada llamada "Contenedor".

### Dockerfile (La Receta)

El archivo `Dockerfile` define cómo se construye la imagen del backend:

1. **Base Image**: `node:version-alpine` (versión ligera de Linux).
2. **Dependencias**: Copia `package.json` y ejecuta `npm install`.
3. **Build**: Compila el código TypeScript de NestJS a JavaScript (`dist/`).
4. **Expose**: Documenta que el contenedor usará el puerto `3000`.

### Docker Compose (La Orquestación)

El archivo `docker-compose.yml` define la infraestructura local como código:

- **Services**: Define `backend` y `frontend` como servicios separados.
- **Networking**: Crea una red virtual privada. El frontend puede comunicarse con el backend usando el nombre del servicio `http://backend:3000` en lugar de IPs, gracias al DNS interno de Docker.
- **Port Mapping**: Mapea los puertos del contenedor al host (tu máquina), permitiendo que accedas a la app desde el navegador.

---

## 3. Despliegue en Railway (PaaS)

Railway es una "Platform as a Service" que abstrae la complejidad de administrar servidores Linux (como AWS EC2 o VPS tradicionales).

### Flujo de CI/CD (Integración y Despliegue Continuo)

1. **Trigger**: Railway está conectado a tu repositorio de GitHub. Al hacer un `git push` a la rama principal (`main` o `master`), Railway detecta el cambio automáticamente.
2. **Build Automático**:
    - Railway clona el repositorio.
    - Detecta la configuración de Docker (o usa Buildpacks) y construye la imagen en su nube.
3. **Deploy**:
    - Despliega la nueva imagen reemplazando la anterior sin tiempo de inactividad (Zero Downtime Deployments, si está configurado).
    - Ejecuta el comando de inicio (`npm run start`).

### Gestión de Variables de Entorno

- En lugar de archivos `.env`, las variables (como `MONGO_URI`, `JWT_SECRET`) se inyectan dinámicamente en el entorno de ejecución del contenedor desde el dashboard de Railway, garantizando la seguridad de las credenciales.

---

## 4. Innovaciones en Frontend (UX/UI)

### Responsividad Avanzada

Se implementó un diseño "Mobile-First" real para asegurar que la plataforma funcione en cualquier dispositivo.

- **Grid Layout Inteligente**: En lugar de `flexbox` simple, utilizamos `CSS Grid` con `minmax()` para que los posters de las películas se reacomoden automáticamente (2 columnas en móvil, 6+ en desktop) sin romper el diseño.
- **Navegación Adaptativa**: En móviles, el menú se transforma para ser accesible táctilmente sin ocultar elementos importantes.

### Reproductor Interactivo (Time-Synced)

Inspirado en plataformas como SoundCloud, el reproductor de video no es estático:

- **Sincronización de Eventos**: Utilizamos `useEffect` en React conectado al evento `timeupdate` del elemento `<video>`.
- **Lógica**: Cada vez que el video avanza, el código verifica si hay reacciones (emojis) guardadas para ese segundo exacto.
- **Overlay**: Si hay coincidencia, se renderiza un componente "flotante" sobre el video en tiempo real, creando una experiencia comunitaria.
