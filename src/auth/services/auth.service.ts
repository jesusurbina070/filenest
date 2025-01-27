import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async singIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByEmail(email);
    const { password, ...result } = user;
    const decrypt = bcrypt.compare(pass, password);
    if (!decrypt) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, user: result };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
