import { PartialType } from '@nestjs/swagger';
import { CreateUserCourseActivityDto } from './create-user-course-activity.dto';

export class UpdateUserCourseActivityDto extends PartialType(CreateUserCourseActivityDto) {}
