import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

// Cargar variables de entorno desde .env
dotenv.config();

async function bootstrap() {
    // crear la app
    // NestJS es genial pero a veces me confunde tanta configuración jaja
    const app = await NestFactory.create(AppModule);

    // habilitar cors para que no de error con el frontend
    // importante: poner el puerto de vite aqui o si no jala wey
    app.enableCors({
        origin: 'http://localhost:5173',
        credentials: true,
    });

    // pipes globales para validar los dtos
    // esto me ayuda a que no manden datos basura (aprendido a la mala)lo vi en con el mirudev
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
