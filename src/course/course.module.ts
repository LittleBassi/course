import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { CourseController } from './course.controller';
import { CourseService } from './services/course.service';
import { CourseRepositoryService } from './services/course.repository.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Course])],
  controllers: [CourseController],
  providers: [CourseService, CourseRepositoryService],
  exports: [CourseService, CourseRepositoryService],
})
export class CourseModule {}
