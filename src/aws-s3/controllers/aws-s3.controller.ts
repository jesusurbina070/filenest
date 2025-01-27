import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Res,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsS3Service } from '../services/aws-s3.service';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('aws-s3')
@UseGuards(AuthGuard)
export class AwsS3Controller {
  constructor(private readonly awsS3Service: AwsS3Service) {}

  @Post('upload')
  @ApiOperation({ summary: 'Subir un archivo a AWS S3' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Archivo subido exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en el archivo enviado.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadedFile(@UploadedFile() file: any) {
    const key = `${Date.now()}-${file.originalname.split(' ').join('')}`;
    const result = await this.awsS3Service.uploadFile(
      key,
      file.buffer,
      file.mimetype,
    );
    return { message: result, key };
  }

  @Get('download/:key')
  @ApiOperation({ summary: 'Obtener la URL de un archivo en AWS S3' })
  @ApiParam({
    name: 'key',
    description: 'Clave única del archivo en AWS S3.',
    example: 'example-key.pdf',
  })
  @ApiResponse({ status: 200, description: 'URL obtenida exitosamente.' })
  @ApiResponse({ status: 404, description: 'Archivo no encontrado.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  async downloadFile(@Param('key') key: string, @Res() res: Response) {
    try {
      const fileStream = await this.awsS3Service.downloadFile(key);

      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-DIsposition': `attachment; filename=${key}`,
      });

      fileStream.pipe(res);
    } catch (err) {
      throw new HttpException(
        `Error downloading file: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':key')
  @ApiOperation({ summary: 'Descargar un archivo de AWS S3' })
  @ApiParam({
    name: 'key',
    description: 'Clave única del archivo en AWS S3.',
    example: 'example-key.pdf',
  })
  @ApiResponse({ status: 200, description: 'Archivo descargado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Archivo no encontrado.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  async getFile(@Param('key') key: string) {
    const url = await this.awsS3Service.getFileUrl(key);
    return { url };
  }

  @Delete(':key')
  @ApiOperation({ summary: 'Obtener la URL de un archivo en AWS S3' })
  @ApiParam({
    name: 'key',
    description: 'Clave única del archivo en AWS S3.',
    example: 'example-key.pdf',
  })
  @ApiResponse({ status: 200, description: 'URL obtenida exitosamente.' })
  @ApiResponse({ status: 404, description: 'Archivo no encontrado.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  async delateFile(@Param('key') key: string) {
    const result = await this.awsS3Service.delateFile(key);
    return { message: result };
  }
}
