import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseActivity } from './entities/course-activity.entity';
import { CourseActivityController } from './course-activity.controller';
import { CourseActivityService } from './services/course-activity.service';
import { CourseActivityRepositoryService } from './services/course-activity.repository.service';
import { UtilsModule } from '@/utils/utils.module';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([CourseActivity]), UtilsModule],
  controllers: [CourseActivityController],
  providers: [CourseActivityService, CourseActivityRepositoryService],
  exports: [CourseActivityService, CourseActivityRepositoryService],
})
export class CourseActivityModule {}
