import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../guards/auth.guard';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authServices: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Login to the application' })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' },
      },
    },
  })
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authServices.singIn(signInDto.email, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Obteniendo el perfil del usuario logueado' })
  @ApiResponse({
    status: 200,
    description: ' Devuelve los datos del perfil del usuario',
  })
  @ApiResponse({ status: 401, description: 'Sin autorización' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token para autenticar al usuario.',
  })
  getProfile(@Request() req) {
    return req.user;
  }
}
