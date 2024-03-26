import { ConflictException, Controller, Get, Param } from '@nestjs/common';
import { AuthDecorator, Decorator, GetUser } from '@/utils/utils.decorator';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @AuthDecorator(true)
  @Decorator('users', 'Todos os usuários cadastrados no banco')
  async find(): Promise<User[]> {
    return await this.userService.findByFilters({});
  }

  @Get(':id')
  @AuthDecorator(true)
  @Decorator('users', 'Dados de um usuário por ID e cursos matriculados')
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.userService.findOneUserWithCourses(+id);
    if (!user) {
      throw new ConflictException('Usuário não encontrado');
    }
    return user;
  }

  @Get('self/info')
  @AuthDecorator()
  @Decorator('users', 'Dados do usuário logado e cursos matriculados')
  async findSelf(@GetUser() user: User): Promise<User> {
    return await this.userService.findOneUserWithCourses(user.id);
  }
}
