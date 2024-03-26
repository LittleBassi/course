import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AuthDecorator, Decorator, GetUser } from '@/utils/utils.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';
import { UserRepositoryService } from './services/user.repository.service';
import { createOrder, stringIdsToArray } from '@/utils/utils.constants';
import { DeleteResult } from 'typeorm';
import { ApiQuery } from '@nestjs/swagger';
import { UserOrderColumn, UserOrderValue, UserRoleEnum } from './entities/user.enum';
import { RegressService } from '@/integrations/regress/services/regress.service';
import { RegressUserData } from '@/integrations/regress/entities/regress.interface';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userRepositoryService: UserRepositoryService,
    private readonly regressService: RegressService
  ) {}

  @Post('admin')
  @AuthDecorator(true)
  @Decorator('user', 'Cria um novo usuário (administrador)')
  async createAdmin(@Body() createUserDto: CreateUserDto): Promise<User> {
    const userExists = await this.userRepositoryService.findOne({ email: createUserDto.email });
    if (userExists) {
      throw new ConflictException('E-mail já existente!');
    }

    const newUser = await this.userService.create({
      ...createUserDto,
      role: UserRoleEnum.ADMIN,
    });
    if (!newUser) {
      throw new ConflictException('Erro ao cadastrar usuário');
    }
    return newUser;
  }

  @Post('common')
  @AuthDecorator(true)
  @Decorator('user', 'Cria um novo usuário (comum)')
  async createCommon(@Body() createUserDto: CreateUserDto): Promise<User> {
    const userExists = await this.userRepositoryService.findOne({ email: createUserDto.email });
    if (userExists) {
      throw new ConflictException('E-mail já existente!');
    }

    const newUser = await this.userService.create({
      ...createUserDto,
      role: UserRoleEnum.COMMON,
    });
    if (!newUser) {
      throw new ConflictException('Erro ao cadastrar usuário');
    }
    return newUser;
  }

  @Get()
  @AuthDecorator(true)
  @ApiQuery({ name: 'id', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'first_name', required: false })
  @ApiQuery({ name: 'last_name', required: false })
  @ApiQuery({ name: 'email', required: false })
  @ApiQuery({ name: 'role', required: false })
  @ApiQuery({ name: 'start_create_datetime', required: false })
  @ApiQuery({ name: 'end_create_datetime', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'order_column', required: false })
  @ApiQuery({ name: 'order_value', required: false })
  @Decorator('user', 'Busca todos os usuários')
  async findAllWithFilters(
    @Query('id') id?: string,
    @Query('search') search?: string,
    @Query('first_name') firstName?: string,
    @Query('last_name') lastName?: string,
    @Query('email') email?: string,
    @Query('role') role?: string,
    @Query('start_create_datetime') startCreateDatetime?: string,
    @Query('end_create_datetime') endCreateDatetime?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('order_column') orderColumn?: string,
    @Query('order_value') orderValue?: string
  ): Promise<User[] | [User[], number]> {
    let idsParams: number[] = [];
    if (search) {
      idsParams = await this.userService.findUserIdsBySearch(search);
    }
    if (id) {
      idsParams = [...idsParams, ...stringIdsToArray(id)];
    }
    const filters = await this.userService.createFilters({
      id: idsParams.length > 0 ? idsParams : null,
      first_name: firstName,
      last_name: lastName,
      email,
      role,
      start_create_datetime: startCreateDatetime,
      end_create_datetime: endCreateDatetime,
    });
    if (!filters) {
      throw new ConflictException('Falha ao aplicar filtros');
    }
    let order = null;
    if (orderColumn && orderValue) {
      const orderParam = createOrder(orderColumn, orderValue, UserOrderColumn, UserOrderValue);
      order = orderParam;
    }
    if ((skip || +skip === 0) && take) {
      return await this.userService.findByFiltersPaged(+skip, +take, filters, order);
    }
    return await this.userService.findByFilters(filters, order);
  }

  @Get(':id')
  @AuthDecorator(true)
  @Decorator('user', 'Busca usuário por ID na API Regress')
  async findSingleUser(@Param('id') id: string): Promise<RegressUserData> {
    const user = await this.regressService.findSingleUser(id);
    if (!user) {
      throw new ConflictException('Usuário não encontrado');
    }
    return user;
  }

  @Get('avatar/:id')
  @AuthDecorator(true)
  @Decorator('user', 'Busca usuário por ID')
  async findOneAvatar(@Param('id') id: string): Promise<User> {
    const user = await this.userService.findOneInfo(+id);
    if (!user) {
      throw new ConflictException('Usuário não encontrado');
    }
    if (user.url) {
      return user;
    }
    const avatar = await this.regressService.findSingleUser(id);
    if (!avatar?.avatar) {
      throw new ConflictException('Avatar não encontrado');
    }
    await this.userRepositoryService.updateAvatar(user, avatar.avatar);
    user.url = avatar.avatar;
    return user;
  }

  @Patch()
  @AuthDecorator()
  @Decorator('user', 'Atualiza usuário logado')
  async updateSelf(
    @GetUser() user: User,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User | null> {
    if (updateUserDto?.email && updateUserDto?.email !== user.email) {
      const userExists = await this.userRepositoryService.findOne({ email: updateUserDto.email });
      if (userExists) {
        throw new ConflictException('E-mail já existente!');
      }
    }
    return await this.userService.update(user.id, updateUserDto);
  }

  @Delete()
  @AuthDecorator()
  @Decorator('user', 'Remove o usuário logado (softDelete)')
  async remove(@GetUser() user: User): Promise<DeleteResult> {
    const deleteResult = await this.userRepositoryService.remove(+user.id);
    if (deleteResult?.affected === 0) {
      throw new ConflictException('Erro ao excluir usuário logado');
    }
    return deleteResult;
  }
}
