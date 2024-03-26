import { Body, Controller, Post } from '@nestjs/common';
import { Decorator } from '@/utils/utils.decorator';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthAccessToken } from './entities/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @Decorator('auth', 'Autenticação do usuário')
  async auth(@Body() createAuthDto: CreateAuthDto): Promise<AuthAccessToken> {
    return await this.authService.auth(createAuthDto);
  }
}
