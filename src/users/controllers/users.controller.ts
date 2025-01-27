import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiBody({
    description: 'Datos requeridos para crear un nuevo usuario.',
    type: CreateUserDto, // Agregamos el esquema del DTO aquí
  })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  async create(@Body() user: CreateUserDto) {
    await this.usersService.create(user);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida correctamente.',
  })
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get('signIn/:email')
  @ApiOperation({ summary: 'Buscar un usuario por email' })
  @ApiParam({
    name: 'email',
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@example.com',
  })
  @ApiResponse({ status: 200, description: 'Usuario encontrado.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async findOneByEmail(@Param('email') email: string) {
    return await this.usersService.findOneByEmail(email);
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  @ApiOperation({
    summary: 'Obtener un usuario por ID con sus archivos asociados',
  })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado con sus archivos asociados.',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async findOneById(@Param('id') id: string) {
    return await this.usersService.findOneUserWithFiles(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Actualizar un usuario por ID (requiere autenticación)',
  })
  @ApiBody({
    description: 'Datos requeridos para actualizar un usuario.',
    type: UpdateUserDto, // Agregamos el esquema del DTO para actualizaciones
  })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado exitosamente.',
  })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async update(@Param('id') id: string, @Body() user: UpdateUserDto) {
    return await this.usersService.update(id, user);
  }
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Eliminar un usuario por ID (requiere autenticación)',
  })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }
}
