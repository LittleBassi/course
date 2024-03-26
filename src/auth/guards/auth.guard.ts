import { User } from '@/user/entities/user.entity';
import { UserRoleEnum } from '@/user/entities/user.enum';
import { IS_ADMIN } from '@/utils/utils.decorator';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);
    const isAdmin = this.reflector.get<string>(IS_ADMIN, context.getHandler());
    if (isAdmin) {
      const req = context.switchToHttp().getRequest();
      const user = req.user as User;
      if (user.role !== UserRoleEnum.ADMIN) {
        throw new UnauthorizedException(
          'Seu perfil não possui acesso a esta funcionalidade. Constulte o suporte.'
        );
      }
    }
    // const req = context.switchToHttp().getRequest();
    // const user = req.user;
    return true;
  }

  handleRequest(error: any, user: User): any {
    if (error || !user) {
      throw error || new UnauthorizedException('Acesso não autorizado.');
    }
    return user;
  }
}
