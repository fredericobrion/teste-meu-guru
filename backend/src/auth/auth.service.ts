import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const foundUser = await this.userService.findByEmail(email);

    if (
      !foundUser ||
      !(await this.validatePassword(password, foundUser.password))
    ) {
      throw new UnauthorizedException('Wrong email and/or password');
    }

    const payload = this.createTokenPayload(foundUser);

    const access_token = await this.jwtService.signAsync(payload);

    return { access_token };
  }

  private async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private createTokenPayload(user: any): any {
    return {
      sub: user.id,
      name: user.name,
      admin: user.admin,
    };
  }
}
