import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class UrlDto {
  @IsString()
  @IsUrl()
  @ApiProperty({
    description: 'URL para visualizar el archivo.',
    example: 'https://example.com/view/documento.pdf',
  })
  view: string; // URL para ver el archivo

  @IsString()
  @IsUrl()
  @ApiProperty({
    description: 'URL para visualizar el archivo.',
    example: 'https://example.com/view/documento.pdf',
  })
  download: string; // URL para descargar el archivo
}
