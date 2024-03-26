import { PartialType } from '@nestjs/swagger';
import { CreateCourseActivityDto } from './create-course-activity.dto';

export class UpdateCourseActivityDto extends PartialType(CreateCourseActivityDto) {}
