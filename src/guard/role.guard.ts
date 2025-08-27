/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { $Enums } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<$Enums.UserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    // No roles specified for route → allow access
    if (!requiredRoles) {
      return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    const user = request.user as { role?: $Enums.UserRole };

    // Ensure user is authenticated
    if (!user || !user.role) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check if user has at least one required role
    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
