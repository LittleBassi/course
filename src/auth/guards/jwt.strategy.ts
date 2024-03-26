import { UserRepositoryService } from '@/user/services/user.repository.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/user/entities/user.entity';
import { JWT_CONSTANTS } from '../auth.constants';
import { AuthPayload } from '../entities/auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userRepositoryService: UserRepositoryService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_CONSTANTS.secret,
    });
  }

  // Valida o conteúdo do token enviado na requisição
  async validate(payload: AuthPayload): Promise<User> {
    const { id } = payload;
    if (!id) {
      throw new UnauthorizedException('Acesso não autorizado. Sem dados de payload.');
    }

    const user = await this.userRepositoryService.findOne({ id });
    if (!user) {
      throw new UnauthorizedException('Acesso não autorizado. Credenciais inválidas.');
    }
    delete user.password;

    return user;
  }
}
