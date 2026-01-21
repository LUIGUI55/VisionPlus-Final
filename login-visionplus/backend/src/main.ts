import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

// Cargar variables de entorno desde .env
dotenv.config();

async function bootstrap() {
    // crear la app
    // NestJS esta chido pero a veces me confunde tanta configuración jaja
    const app = await NestFactory.create(AppModule);

    // habilitar cors para que no de error con el frontend
    // importante: poner el puerto de vite aqui o si no jala wey
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });

    // pipes globales para validar los dtos
    // esto me ayuda a que no manden datos basura (aprendido a la mala)lo vi con el mirudev
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true, // borra lo que no este en el dto
        // transform: true, // esto a veces da problemas, mejor lo dejo comentado por si acaso
    }));

    // usar el puerto del env o el 3000 por defecto
    const port = process.env.PORT || 3000;

    await app.listen(port);

    console.log('------------------------------------------------');
    console.log(` Servidor iniciado correctamente`);
    console.log(` Escuchando en: http://localhost:${port}`);
    console.log('------------------------------------------------');
    console.log('Esperando peticiones... (ojalá no explote)');
}
bootstrap();
// Deploy trigger: 01/20/2026 18:39:56
// Deploy trigger 2: 01/20/2026 19:04:41
