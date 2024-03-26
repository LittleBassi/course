import { Injectable } from '@nestjs/common';
import { CreateUserCourseDto } from '../dto/create-user-course.dto';
import { UpdateUserCourseDto } from '../dto/update-user-course.dto';
import { UserCourse } from '../entities/user-course.entity';
import { UserCourseRepositoryService } from './user-course.repository.service';

@Injectable()
export class UserCourseService {
  constructor(private readonly userCourseRepositoryService: UserCourseRepositoryService) {}

  async create(createUserCourseDto: CreateUserCourseDto): Promise<UserCourse> {
    const userCourseEntity = await this.userCourseRepositoryService.create(createUserCourseDto);
    await this.userCourseRepositoryService.save(userCourseEntity);
    if (!userCourseEntity.id) {
      return null;
    }
    return await this.userCourseRepositoryService.findOne({ id: userCourseEntity.id });
  }

  async update(id: number, upateUserCourseDto: UpdateUserCourseDto): Promise<UserCourse> {
    const userCourseEntity = await this.userCourseRepositoryService.create(upateUserCourseDto);
    await this.userCourseRepositoryService.update(id, userCourseEntity);
    return await this.userCourseRepositoryService.findOne({ id });
  }
}
