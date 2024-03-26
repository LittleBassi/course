import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCourse } from './entities/user-course.entity';
import { UserCourseRepositoryService } from './services/user-course.repository.service';
import { UserCourseService } from './services/user-course.service';
import { UserCourseController } from './user-course.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserCourse])],
  controllers: [UserCourseController],
  providers: [UserCourseService, UserCourseRepositoryService],
  exports: [UserCourseService, UserCourseRepositoryService],
})
export class UserCourseModule {}
