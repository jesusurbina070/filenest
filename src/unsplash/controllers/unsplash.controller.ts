import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { UnsplashService } from '../services/unsplash.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('unsplash')
@UseGuards(AuthGuard)
export class UnsplashController {
  constructor(private readonly unsplashService: UnsplashService) {}

  @Get('list')
  @ApiOperation({ summary: 'Obtener una lista de imágenes desde Unsplash' })
  @ApiResponse({
    status: 200,
    description: 'Lista de imágenes obtenida exitosamente.',
  })
  @ApiResponse({ status: 401, description: 'Usuario no autenticado.' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token para autenticar al usuario.',
  })
  async getImageList() {
    return this.unsplashService.getImageList();
  }

  @Post('upload')
  @ApiOperation({
    summary: 'Subir una imagen desde Unsplash a AWS S3',
  })
  @ApiBody({
    description: 'Datos necesarios para subir una imagen',
    schema: {
      type: 'object',
      properties: {
        imageUrl: {
          type: 'string',
          description: 'URL de la imagen desde Unsplash',
          example: 'https://images.unsplash.com/photo-123456789',
        },
        fileName: {
          type: 'string',
          description: 'Nombre que se asignará al archivo en S3',
          example: 'my-unsplash-image.jpg',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Imagen subida exitosamente a AWS S3.',
  })
  @ApiResponse({ status: 400, description: 'Error al procesar la solicitud.' })
  @ApiResponse({ status: 401, description: 'Usuario no autenticado.' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token para autenticar al usuario.',
  })
  async uploadImage(
    @Body() body: { imageUrl: string; fileName: string },
    @Req() req: any,
  ) {
    const { imageUrl, fileName } = body;
    const { user } = req.user;

    return await this.unsplashService.uploadImage(imageUrl, fileName, user);
  }
}
