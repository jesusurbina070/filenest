import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';
import { UrlDto } from './url.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFileDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    description:
      'ID único del archivo (UUID). Si no se proporciona, se generará automáticamente.',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  id: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  @ApiProperty({
    description: 'Nombre del archivo.',
    example: 'documento.pdf',
    minLength: 3,
    maxLength: 50,
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description:
      'Clave única del archivo en el almacenamiento (por ejemplo, en S3).',
    example: 'folder/subfolder/documento.pdf',
  })
  key: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UrlDto)
  @IsObject()
  @ApiPropertyOptional({
    description: 'URL asociada al archivo.',
    type: UrlDto,
  })
  url: UrlDto;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Tipo de contenido MIME del archivo.',
    example: 'application/pdf',
  })
  contentType: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Tamaño del archivo en bytes.',
    example: '1048576', // 1 MB
  })
  size: string;

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({
    description: 'Usuario asociado con el archivo.',
    type: CreateUserDto,
  })
  @Type(() => CreateUserDto)
  user: CreateUserDto;
}
