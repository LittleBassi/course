import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import { UserRepositoryService } from './services/user.repository.service';
import { UsersController } from './users.controller';
import { RegressModule } from '@/integrations/regress/regress.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RegressModule,
  ],
  controllers: [UserController, UsersController],
  providers: [UserService, UserRepositoryService],
  exports: [UserService, UserRepositoryService],
})
export class UserModule {}
