import { Injectable } from '@nestjs/common';
import { CreateUserCourseActivityDto } from '../dto/create-user-course-activity.dto';
import { UserCourseActivity } from '../entities/user-course-activity.entity';
import { UserCourseActivityRepositoryService } from './user-course-activity.repository.service';

@Injectable()
export class UserCourseActivityService {
  constructor(
    private readonly userCourseActivityRepositoryService: UserCourseActivityRepositoryService
  ) {}

  async create(
    createUserCourseActivityDto: CreateUserCourseActivityDto,
    file: Express.Multer.File
  ): Promise<UserCourseActivity> {
    const userCourseActivityEntity = await this.userCourseActivityRepositoryService.create(
      createUserCourseActivityDto,
      file
    );
    await this.userCourseActivityRepositoryService.save(userCourseActivityEntity);
    if (!userCourseActivityEntity.id) {
      return null;
    }
    return await this.userCourseActivityRepositoryService.findOne({
      id: userCourseActivityEntity.id,
    });
  }
}
