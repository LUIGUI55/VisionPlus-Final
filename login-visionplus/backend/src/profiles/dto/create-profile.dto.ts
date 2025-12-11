import { IsNotEmpty, IsString, MaxLength, IsBoolean, IsOptional } from 'class-validator';

export class CreateProfileDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre del perfil es requerido' })
    @MaxLength(30, { message: 'El nombre no puede tener más de 30 caracteres' })
    name: string;

    @IsString()
    @IsOptional()
    avatar?: string; // Emoji o URL

    @IsBoolean()
    @IsOptional()
    isKids?: boolean;
}
