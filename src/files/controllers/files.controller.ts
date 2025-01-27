import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CreateFileDto } from '../dto/create-file.dto';
import { FilesService } from '../services/files.service';
import { UpdateFileDto } from '../dto/update-file.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('files')
@UseGuards(AuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('create')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Subir un archivo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos del archivo y metadatos para subirlo.',
    type: CreateFileDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Archivo subido correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada no válidos.',
  })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token para autenticar al usuario.',
  })
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile() fileData: any,
    @Body() createFileDto: CreateFileDto,
    @Req() req: any,
  ) {
    const user = req.user.user;
    return this.filesService.create({ ...createFileDto }, fileData, user);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todos los archivos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de archivos obtenida correctamente.',
  })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token para autenticar al usuario.',
  })
  findAll() {
    return this.filesService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener un archivo por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID único del archivo',
    example: 'b34f5a62-4a22-4a54-93ab-1b645c72eaf4',
  })
  @ApiResponse({
    status: 200,
    description: 'Archivo obtenido correctamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Archivo no encontrado.',
  })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(id);
  }
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token para autenticar al usuario.',
  })
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un archivo' })
  @ApiParam({
    name: 'id',
    description: 'ID único del archivo a actualizar',
    example: 'b34f5a62-4a22-4a54-93ab-1b645c72eaf4',
  })
  @ApiBody({
    description: 'Datos actualizados del archivo.',
    type: UpdateFileDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Archivo actualizado correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada no válidos.',
  })
  @ApiResponse({
    status: 404,
    description: 'Archivo no encontrado.',
  })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token para autenticar al usuario.',
  })
  update(@Param('id') id: string, @Body() file: UpdateFileDto) {
    return this.filesService.update(id, file);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un archivo' })
  @ApiParam({
    name: 'id',
    description: 'ID único del archivo a eliminar',
    example: 'b34f5a62-4a22-4a54-93ab-1b645c72eaf4',
  })
  @ApiResponse({
    status: 200,
    description: 'Archivo eliminado correctamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Archivo no encontrado.',
  })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token para autenticar al usuario.',
  })
  remove(@Param('id') id: string) {
    return this.filesService.remove(id);
  }
}
