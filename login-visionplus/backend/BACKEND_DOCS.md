# Documentación del Backend: El Cerebro de la Operación

¡Hola! Si estás leyendo esto, es porque te interesa saber cómo funciona la "magia" detrás de nuestra plataforma de video. Aquí no vamos a usar términos súper complicados ni diagramas aburridos. Vamos a explicar cómo fluyen los datos en las partes más importantes: **Login, Registro, Usuarios y Perfiles**.

También hablaremos de esa carpeta misteriosa llamada `dist`.

---

## Auth: La Puerta de Entrada (`/src/auth`)

Esta es probablemente la parte más crítica. Aquí es donde decidimos quién entra y quién se queda fuera.

### 1. Login (`auth.service.ts` -> `login`)
Cuando alguien intenta entrar, esto es lo que pasa:
1.  **Recibimos email y contraseña**: El usuario nos manda sus datos.
2.  **Buscamos al usuario**: Le preguntamos a la base de datos "¿Oye, conoces a este email?". Si no existe, lanzamos un error (pero no decimos "el usuario no existe" por seguridad, solo "credenciales inválidas").
3.  **El Examen de la Contraseña**: Si el usuario existe, comparamos la contraseña que nos dio con la que tenemos guardada. **OJO**: La contraseña en la base de datos está "hasheada" (encriptada), así que usamos `bcrypt` para compararlas de forma segura.
4.  **El Ticket de Entrada (JWT)**: Si todo coincide, le damos un premio: un **Token JWT**. Este token es como un brazalete de festival; mientras lo tenga puesto, puede entrar a las zonas VIP (endpoints protegidos) sin tener que mostrar su identificación a cada rato.

### 2. Registro (`auth.service.ts` -> `register`)
Para los nuevos:
1.  **Chequeo de Duplicados**: Primero revisamos si el email ya existe. Si ya está, les decimos que no se puede repetir.
2.  **Encriptación**: Tomamos su contraseña y la pasamos por `bcrypt` para convertirla en un garabato ilegible (hash). **Nunca guardamos contraseñas en texto plano**.
3.  **Guardado**: Creamos el usuario en la base de datos y lo guardamos.
4.  **Limpieza**: Devolvemos la info del usuario creado, pero **sin la contraseña**, para que no viaje por la red innecesariamente.

### 3. Recuperación de Contraseña (`auth.service.ts` -> `forgotPassword` / `resetPassword`)
Si alguien pierde su llave:
1.  **Generamos un Token Temporal**: Creamos un código raro y único que dura solo 1 hora.
2.  **Lo guardamos**: Se lo pegamos al usuario en la base de datos.
3.  **"Enviamos el correo"**: (En realidad, por ahora solo lo mostramos en la consola para pruebas, pero la idea es mandar un email real).
4.  **El Reset**: Cuando el usuario vuelve con ese token y su nueva contraseña, verificamos que el token sea válido y no haya expirado. Si todo está bien, actualizamos la contraseña (hasheada de nuevo, claro) y borramos el token usado.

---

## Users: La Identidad (`/src/users`)

Esta carpeta es pequeña pero poderosa.
Principalmente contiene la **Entidad User** (`user.entity.ts`). Piensa en esto como el "molde" de lo que es un usuario en nuestra base de datos.

Un usuario tiene:
-   `id`: Un número único.
-   `email`: Su correo.
-   `password`: La contraseña encriptada.
-   `resetToken`: El token temporal si pidió recuperar contraseña.
-   `createdAt`: Cuándo se unió a nosotros.

No hay mucha lógica aquí porque la lógica de "hacer cosas con usuarios" suele vivir en `Auth` (para entrar) o en `Profiles` (para gestionar sus perfiles).

---

## Profiles: Los Espectadores (`/src/profiles`)

Aquí es donde vive la personalización. Un usuario (la cuenta que paga) puede tener varios perfiles (las personas que ven).

### Reglas de la Casa:
1.  **Máximo 5 Perfiles**: En `profiles.service.ts`, antes de crear un perfil, contamos cuántos tiene el usuario. Si ya tiene 5, le decimos "¡Para el carro! Ya son muchos".
2.  **Pertenencia**: Cada perfil está atado a un `userId`. No existen perfiles huérfanos.

### Lo que podemos hacer (CRUD):
-   **Crear**: Nombre, avatar, idioma, etc.
-   **Listar**: `findByUser` nos trae todos los perfiles de una cuenta, ordenaditos por fecha de creación.
-   **Editar**: Si quieren cambiarse el nombre o el avatar.
-   **Borrar**: Si el primo ya no paga su parte, ¡adiós perfil!

---

##  Dist: El Paquete Final (`/dist`)

Verás una carpeta llamada `dist` en la raíz. **¡No toques nada ahí!**

Esa carpeta es el resultado de la "transpilación". Nosotros escribimos en **TypeScript** (que es más ordenado y seguro), pero Node.js (el servidor) habla **JavaScript**.
Cuando ejecutamos `npm run build`, la computadora traduce todo nuestro código bonito de `src` y lo pone en versión JavaScript feo pero eficiente dentro de `dist`.

-   `src`: Zona de trabajo (Humanos).
-   `dist`: Zona de ejecución (Máquinas).

Si borras `dist`, no pasa nada, se vuelve a crear cuando construyes el proyecto. Pero nunca intentes editar archivos ahí dentro, porque tus cambios se perderán la próxima vez que compiles.

---

### Resumen para Desarrolladores (TL;DR)
-   **Auth**: JWT, Bcrypt, Guards. Todo lo de seguridad vive aquí.
-   **Users**: Solo la definición de la tabla de usuarios.
-   **Profiles**: Lógica de negocio de los perfiles (límite de 5, relaciones).
-   **Dist**: Código compilado. Ignóralo.

¡Y eso es todo! Así es como funciona el motor de nuestra plataforma.