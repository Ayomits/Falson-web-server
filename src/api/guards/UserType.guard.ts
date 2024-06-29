import { CanActivate, ExecutionContext, SetMetadata } from '@nestjs/common';
import { UserType } from '../common/types/user';
import { JwtPayload } from '../common';
import { Reflector } from '@nestjs/core';

const UserTypeDecorator = (required: UserType) =>
  SetMetadata(`requiredType`, required);

export class UserTypeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    try {
      const user = req.user as JwtPayload;
      const requiredType = this.reflector.get<number>(
        'requiredType',
        context.getHandler(),
      );
      return user.type >= requiredType;
    } catch {
      return false;
    }
  }
}
