import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  id?: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico del usuario.',
    example: 'user@example.com',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'Nueva contraseña para el usuario.',
    example: 'securePassword123',
    minLength: 6,
    maxLength: 100,
  })
  password?: string;

  @ApiPropertyOptional({
    description: 'Nombre completo del usuario.',
    example: 'Juan Pérez',
    minLength: 3,
    maxLength: 50,
  })
  name?: string;
}
