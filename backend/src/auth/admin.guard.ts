import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ADMIN_KEY } from './admin-auth.decorator';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isAdminRequired = this.reflector.getAllAndOverride<boolean>(
      ADMIN_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!isAdminRequired) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return user && user.admin === true;
  }
}
