import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    // endpoint protegido para probar el JWT
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user; // el guard agrega el user al request
    }

    // Endpoint temporal para crear usuario de prueba
    // TODO: mover esto a un seeder o quitarlo en produccion
    @Post('create-test-user')
    async createTestUser() {
        try {
            const user = await this.authService.createUser(
                'test@example.com',
                'password123'
            );
            return { mensaje: 'Usuario de prueba creado', email: user.email };
        } catch (error) {
            return { mensaje: 'El usuario ya existe o hubo un error', error: error.message };
        }
    }

    // Recuperación de contraseña - solicitar token
    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto.email);
    }

    // Recuperación de contraseña - resetear con token
    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(
            resetPasswordDto.token,
            resetPasswordDto.newPassword
        );
    }
}
