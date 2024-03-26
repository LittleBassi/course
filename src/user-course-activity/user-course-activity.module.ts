import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCourseActivity } from './entities/user-course-activity.entity';
import { UserCourseActivityRepositoryService } from './services/user-course-activity.repository.service';
import { UserCourseActivityService } from './services/user-course-activity.service';
import { UserCourseActivityController } from './user-course-activity.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserCourseActivity])],
  controllers: [UserCourseActivityController],
  providers: [UserCourseActivityService, UserCourseActivityRepositoryService],
  exports: [UserCourseActivityService, UserCourseActivityRepositoryService],
})
export class UserCourseActivityModule {}
