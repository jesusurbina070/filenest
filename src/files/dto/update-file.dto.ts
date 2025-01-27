import { PartialType } from '@nestjs/mapped-types';
import { CreateFileDto } from './create-file.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UrlDto } from './url.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class UpdateFileDto extends PartialType(CreateFileDto) {
  @ApiPropertyOptional({
    description: 'ID único del archivo (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id?: string;

  @ApiPropertyOptional({
    description: 'Nombre del archivo',
    example: 'documento.pdf',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Clave única en el almacenamiento (AWS S3, por ejemplo)',
    example: 'folder/documento.pdf',
  })
  key?: string;

  @ApiPropertyOptional({
    description: 'URLs asociadas al archivo',
    type: UrlDto,
  })
  url?: UrlDto;

  @ApiPropertyOptional({
    description: 'Tipo de contenido del archivo',
    example: 'application/pdf',
  })
  contentType?: string;

  @ApiPropertyOptional({
    description: 'Tamaño del archivo en bytes',
    example: '102400',
  })
  size?: string;

  @ApiPropertyOptional({
    description: 'Usuario asociado al archivo',
    type: CreateUserDto,
  })
  user?: CreateUserDto;
}
