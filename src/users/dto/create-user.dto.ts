import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Length,
  IsEmail,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'Correo electrónico del usuario.',
    example: 'juan.perez@example.com',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 100)
  @ApiPropertyOptional({
    description: 'Nueva contraseña para el usuario.',
    example: 'securePassword123',
    minLength: 6,
    maxLength: 100,
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  @ApiProperty({
    description:
      'Nombre completo del usuario. Debe tener entre 3 y 50 caracteres.',
    example: 'Juan Pérez',
  })
  name: string;
}
