# Documentación de Base de Datos - VisionPlus

## Elección de Tecnología: ¿Por qué MongoDB?

Para VisionPlus, elegí **MongoDB** (una base de datos NoSQL) en lugar de una tradicional SQL (como MySQL o PostgreSQL).

### Mis razones principales

1. **Flexibilidad**: Los datos de un proyecto de streaming pueden variar. Por ejemplo, una película tiene una duración, pero una serie tiene temporadas y episodios. MongoDB me permite guardar documentos con estructuras ligeramente diferentes en la misma colección sin problemas.
2. **Velocidad de Desarrollo**: Usando NestJS con Mongoose, puedo definir mis esquemas directamente en el código (TypeScript) y la base de datos se adapta. No tengo que correr migraciones complicadas cada vez que agrego un campo nuevo.
3. **Escalabilidad**: Si el proyecto crece a millones de usuarios (¡ojalá!), MongoDB maneja muy bien grandes volúmenes de datos no estructurados.

---

## Estructura de Colecciones

A diferencia de las "Tablas" en SQL, aquí tenemos "Colecciones" de "Documentos" (que parecen objetos JSON).

### 1. Colección: `users` (Usuarios)

Aquí vive la información cruda de la cuenta. Es la puerta de entrada.

| Campo | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Sí | Identificador único generado por Mongo. |
| `email` | String | **Sí** | Correo electrónico. Debe ser único en todo el sistema. |
| `password` | String | **Sí** | Contraseña encriptada (Hash). Nunca guardamos texto plano. |
| `createdAt` | Date | Auto | Fecha de registro. |
| `updatedAt` | Date | Auto | Fecha de última modificación. |

> **Nota**: No guardamos nombre ni apellido aquí. Eso va en los perfiles, porque una cuenta puede ser usada por varias personas.

### 2. Colección: `profiles` (Perfiles)

Esta es la colección que realmente interactúa con la app. Cada cuenta puede tener varios perfiles (Max. 5).

| Campo | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `name` | String | **Sí** | El nombre visible (ej. "Papá", "Juanito"). |
| `avatar` | String | No | URL de la imagen o un emoji. Por defecto es '😊'. |
| `isKids` | Boolean | No | Si es `true`, la interfaz cambia (planeado para futuro). |
| `userId` | ObjectId | **Sí** | **Relación Clave**: Apunta al `_id` de la colección `users`. |

> **Relación Lógica (1 a N)**: Un Usuario -> Muchos Perfiles.

### 3. Colección: `videos` (Mapeo de Contenido)

Esta es la parte más inteligente del sistema. En lugar de guardar todos los datos de TMDB, guardamos un "mapa" que conecta TMDB con nuestro proveedor de video (Bunny.net/HLS).

| Campo | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `tmdbId` | Number | **Sí** | El ID oficial de la película en The Movie Database. |
| `title` | String | No | Título para referencia interna. |
| `bunnyVideoId` | String | **Sí** | El ID del video físico en nuestro storage o la URL del HLS. |
| `libraryId` | String | **Sí** | ID de la librería en Bunny.net. |
| `type` | String | No | `'movie'` (Película) o `'tv'` (Serie). Default: 'movie'. |
| `season` | Number | Opcional | Número de temporada (Solo si `type` es 'tv'). |
| `episode` | Number | Opcional | Número de episodio (Solo si `type` es 'tv'). |

### ¿Cómo funciona la búsqueda de videos?

Cuando entras a ver "Titanic":

1. El frontend tiene el ID de TMDB de Titanic (ej. `597`).
2. El backend busca en esta colección: `db.videos.findOne({ tmdbId: 597 })`.
3. Si lo encuentra, devuelve el `bunnyVideoId` para reproducirlo.
4. Si no, devuelve un error o un demo.

Esto nos permite tener una interfaz con millones de películas (vía API TMDB) pero solo pagar almacenamiento por las que realmente hemos subido.

---

## Diagrama Mental de Relaciones

```mermaid
graph LR
    User[Usuario (Cuenta)] -->|Tiene| Profile1[Perfil: Papá]
    User -->|Tiene| Profile2[Perfil: Hijos]
    
    Profile1 -->|Ve| Video[Película Reproduciéndose]
    
    Video -->|Conecta| TMDB[Metadata (Poster, Sinopsis)]
    Video -->|Conecta| Storage[Archivo de Video (HLS)]
```

Esta estructura mantiene la base de datos ligera y rápida.
