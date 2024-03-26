import {
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
} from '@nestjs/common';
import { AuthDecorator, Decorator, GetUser, UploadDecorator } from '@/utils/utils.decorator';
import { CreateUserCourseActivityDto } from './dto/create-user-course-activity.dto';
import { UserCourseActivity } from './entities/user-course-activity.entity';
import { UserCourseActivityRepositoryService } from './services/user-course-activity.repository.service';
import { UserCourseActivityService } from './services/user-course-activity.service';
import { CourseActivityRepositoryService } from '@/course-activity/services/course-activity.repository.service';
import { User } from '@/user/entities/user.entity';
import { UserCourseRepositoryService } from '@/user-course/services/user-course.repository.service';

@Controller('user-course-activity')
export class UserCourseActivityController {
  constructor(
    private readonly userCourseActivityService: UserCourseActivityService,
    private readonly userCourseActivityRepositoryService: UserCourseActivityRepositoryService,
    private readonly userCourseRepositoryService: UserCourseRepositoryService,
    private readonly courseActivityRepositoryService: CourseActivityRepositoryService
  ) {}

  @Post()
  @AuthDecorator()
  @UploadDecorator('file', 'user-course-activity')
  @Decorator('user-course-activity', 'Cria uma nova entrega de atividade')
  async create(
    @Body() createUserCourseActivityDto: CreateUserCourseActivityDto,
    @UploadedFile()
    file: Express.Multer.File,
    @GetUser() user: User
  ): Promise<UserCourseActivity> {
    const isUserInCourse = await this.userCourseRepositoryService.findOne({
      user_id: user.id,
      course_id: +createUserCourseActivityDto.course_id,
    });
    if (!isUserInCourse) {
      throw new ConflictException('Usuário não está matriculado neste curso.');
    }
    const activityExists = await this.courseActivityRepositoryService.findOne({
      id: +createUserCourseActivityDto.course_activity_id,
      course_id: +createUserCourseActivityDto.course_id,
    });
    if (!activityExists) {
      throw new ConflictException('Atividade de curso não encontrada');
    }

    const newUserCourseActivity = await this.userCourseActivityService.create(
      {
        ...createUserCourseActivityDto,
        user_id: user.id,
      },
      file
    );
    if (!newUserCourseActivity) {
      throw new ConflictException('Erro ao enviar entrega de atividade');
    }
    return newUserCourseActivity;
  }

  @Get(':id')
  @AuthDecorator(true)
  @Decorator('user-course-activity', 'Busca entrega de atividade por ID')
  async findById(@Param('id') id: string): Promise<UserCourseActivity> {
    const userCourseActivityExists = await this.userCourseActivityRepositoryService.findOne({
      id: +id,
    });
    if (!userCourseActivityExists) {
      throw new ConflictException('Entrega de atividade não encontrada');
    }
    return userCourseActivityExists;
  }

  @Get('activity/:course_activity_id')
  @AuthDecorator(true)
  @Decorator('user-course-activity', 'Busca entregas por ID de atividade')
  async findByCourseActivityId(
    @Param('course_activity_id') courseActivityId: string
  ): Promise<UserCourseActivity[]> {
    const activityExists = await this.courseActivityRepositoryService.findOne({
      id: +courseActivityId,
    });
    if (!activityExists) {
      throw new ConflictException('Atividade de curso não encontrada');
    }
    return await this.userCourseActivityRepositoryService.find({
      course_activity_id: +activityExists.id,
    });
  }
}
