import { UserRepositoryService } from '@/user/services/user.repository.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthAccessToken, AuthPayload } from './entities/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepositoryService: UserRepositoryService,
    private readonly jwtService: JwtService
  ) {}

  async getDecodedToken(authorization: string): Promise<any> {
    if (!authorization) {
      return null;
    }

    const token = authorization.split('Bearer ')[1];
    if (!token) {
      return null;
    }
    return this.jwtService.decode(token);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepositoryService.findOne({ email });
    if (!user) {
      return null;
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  // Retorna os dados do usuário (opcional) e o access_token ao fazer login
  async auth(createAuthDto: CreateAuthDto): Promise<AuthAccessToken> {
    // Usuário
    const user = await this.validateUser(createAuthDto.email, createAuthDto.password);
    if (!user) {
      throw new UnauthorizedException('Usuário inexistente.');
    }

    // Payload
    const payload: AuthPayload = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    };

    return {
      // Gera um token JWT com base nos dados do usuário
      access_token: this.jwtService.sign(payload),
    };
  }
}
