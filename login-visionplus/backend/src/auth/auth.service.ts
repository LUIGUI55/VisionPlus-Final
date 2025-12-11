import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/schemas/user.schema';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,
        private jwtService: JwtService,
    ) { }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        console.log('Intentando loguear a:', email);

        // buscar user por email
        // si no lo encuentro, lanzo error de una
        const user = await this.userModel.findOne({ email });

        if (!user) {
            console.log('El usuario no existe');
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // verificar password
        // hay que comparar la pass plana con la hasheada
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log('Password incorrecto');
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // generar token
        // aqui guardo el id y el email en el token
        const payload = { sub: user._id, email: user.email };
        const token = await this.jwtService.signAsync(payload);

        console.log('Login exitoso para:', email);
        console.log('Token generado:', token);

        return {
            access_token: token,
            user: {
                id: user._id,
                email: user.email,
            },
        };
    }

    // metodo para crear usuarios (util para testing)
    async createUser(email: string, password: string) {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new this.userModel({
            email,
            password: hashedPassword,
        });

        return await user.save();
    }

    // Registro de nuevos usuarios
    async register(registerDto: { email: string; password: string; name?: string }) {
        const { email, password, name } = registerDto;

        console.log('Registrando nuevo usuario:', email);

        // Verificar si el email ya existe
        const existingUser = await this.userModel.findOne({ email });

        if (existingUser) {
            console.log('Ya existe alguien con ese correo');
            throw new UnauthorizedException('El correo electrónico ya está registrado');
        }

        // Crear usuario
        // siempre hashear la password antes de guardar!!
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new this.userModel({
            email,
            password: hashedPassword,
            // Si agregamos campo 'name' a User entity, lo usamos aquí
        });

        const savedUser = await user.save();

        console.log('Usuario registrado y guardado en DB:', email);

        // Retornar sin el password para que no se vea
        const userObject = savedUser.toObject();
        const { password: _, ...userWithoutPassword } = userObject;
        return userWithoutPassword;
    }

    // validar usuario por ID (usado por JWT strategy)
    async validateUserById(userId: string) {
        const user = await this.userModel.findById(userId);

        if (!user) {
            throw new UnauthorizedException();
        }

        // no retornar el password
        const userObject = user.toObject();
        const { password, ...result } = userObject;
        return result;
    }

    // Recuperación de contraseña - paso 1: generar token
    // Recuperación de contraseña - paso 1: generar token
    async forgotPassword(email: string) {
        console.log('Solicitud de recuperacion para:', email);

        const user = await this.userModel.findOne({ email });

        if (!user) {
            // Por seguridad, no revelamos si el email existe o no
            // aunque para debuggear a veces es molesto jaja
            console.log('El correo no existe, pero no le digo al usuario');
            return {
                message: 'Si el correo existe, recibirás instrucciones para recuperar tu contraseña',
            };
        }

        // Generar token aleatorio
        // uso random string porque es mas facil
        const resetToken = Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);

        // Token expira en 1 hora
        const resetTokenExpiry = new Date();
        resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);

        // Guardar token en la base de datos
        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        console.log('------------------------------------------------');
        console.log('Token de recuperación generado para:', email);
        console.log('Token (copiar esto para resetear):', resetToken);
        console.log('Expira en:', resetTokenExpiry);
        console.log('------------------------------------------------');

        // TODO: En producción, enviar email con el link de reset
        // Por ahora, retornamos el token en consola para testing
        return {
            message: 'Si el correo existe, recibirás instrucciones para recuperar tu contraseña',
            // Solo para desarrollo:
            devToken: resetToken, // Eliminar esto en producción
        };
    }

    // Recuperación de contraseña - paso 2: resetear con token
    async resetPassword(token: string, newPassword: string) {
        // Buscar usuario con el token
        const user = await this.userModel.findOne({
            resetToken: token,
        });

        if (!user) {
            throw new UnauthorizedException('Token inválido o expirado');
        }

        // Verificar que el token no haya expirado
        if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
            throw new UnauthorizedException('Token inválido o expirado');
        }

        // Hashear nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Actualizar contraseña y limpiar token
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();

        console.log('Contraseña actualizada para:', user.email);

        return {
            message: 'Contraseña actualizada exitosamente. Ya puedes iniciar sesión.',
        };
    }
}

