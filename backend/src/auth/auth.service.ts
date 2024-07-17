import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    const foundUser = await this.userService.findByEmail(email);

    if (!foundUser || !bcrypt.compareSync(password, foundUser.password)) {
      throw new UnauthorizedException('Wrong email and/or password');
    }

    const payload = {
      sub: foundUser.id,
      name: foundUser.name,
      admin: foundUser.admin,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
