import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthDecorator, Decorator, GetUser } from '@/utils/utils.decorator';
import { DeleteResult } from 'typeorm';
import { CourseActivityService } from './services/course-activity.service';
import { CourseActivityRepositoryService } from './services/course-activity.repository.service';
import { CreateCourseActivityDto } from './dto/create-course-activity.dto';
import { CourseActivity } from './entities/course-activity.entity';
import { CourseRepositoryService } from '@/course/services/course.repository.service';
import { UpdateCourseActivityDto } from './dto/update-course-activity.dto';
import { User } from '@/user/entities/user.entity';
import { UserCourseRepositoryService } from '@/user-course/services/user-course.repository.service';
import RabbitmqServer from '@/config/rabbitmq-server';
import { ConfigService } from '@nestjs/config';

@Controller('course-activity')
export class CourseActivityController {
  private readonly rabbitMqUri: string;
  private readonly rabbitMqQueue: string;
  constructor(
    private readonly courseActivityService: CourseActivityService,
    private readonly courseActivityRepositoryService: CourseActivityRepositoryService,
    private readonly courseRepositoryService: CourseRepositoryService,
    private readonly userCourseRepositoryService: UserCourseRepositoryService,
    private readonly configService: ConfigService
  ) {
    this.rabbitMqUri = this.configService.get<string>('RABBITMQ_URI');
    this.rabbitMqQueue = this.configService.get<string>('RABBITMQ_QUEUE');
  }

  @Post()
  @AuthDecorator(true)
  @Decorator('course-activity', 'Cria uma nova atividade de curso')
  async create(@Body() createCourseActivityDto: CreateCourseActivityDto): Promise<CourseActivity> {
    const courseExists = await this.courseRepositoryService.findOne({
      id: +createCourseActivityDto.course_id,
    });
    if (!courseExists) {
      throw new ConflictException('Curso não encontrado');
    }
    const newCourseActivity = await this.courseActivityService.create(createCourseActivityDto);
    if (!newCourseActivity) {
      throw new ConflictException('Erro ao cadastrar atividade de curso');
    }
    const server = new RabbitmqServer(this.rabbitMqUri);
    await server.start();
    await server.publishInQueue(this.rabbitMqQueue, JSON.stringify(newCourseActivity));
    return newCourseActivity;
  }

  @Get(':id')
  @AuthDecorator(true)
  @Decorator('course-activity', 'Busca atividade de curso por ID')
  async findById(@Param('id') id: string): Promise<CourseActivity> {
    const courseActivityExists = await this.courseActivityRepositoryService.findOne({
      id: +id,
    });
    if (!courseActivityExists) {
      throw new ConflictException('Atividade de curso não encontrada');
    }
    return courseActivityExists;
  }

  @Get(':id/user')
  @AuthDecorator()
  @Decorator('course-activity', 'Busca atividade de curso matriculado por ID')
  async findByIdAndUser(@Param('id') id: string, @GetUser() user: User): Promise<CourseActivity> {
    const courseActivityExists = await this.courseActivityRepositoryService.findOne({
      id: +id,
    });
    if (!courseActivityExists) {
      throw new ConflictException('Atividade de curso não encontrada');
    }
    const isUserInCourse = await this.userCourseRepositoryService.findOne({
      user_id: user.id,
      course_id: courseActivityExists.course_id,
    });
    if (!isUserInCourse) {
      throw new ConflictException('Usuário não está matriculado neste curso.');
    }
    return courseActivityExists;
  }

  @Get('course/:course_id')
  @AuthDecorator(true)
  @Decorator('course-activity', 'Busca atividades por ID de curso')
  async findByCourse(@Param('course_id') courseId: string): Promise<CourseActivity[]> {
    const courseExists = await this.courseRepositoryService.findOne({
      id: Number(courseId),
    });
    if (!courseExists) {
      throw new ConflictException('Curso não encontrado');
    }
    return await this.courseActivityRepositoryService.find({ course_id: courseExists.id });
  }

  @Get('user/course/:course_id')
  @AuthDecorator()
  @Decorator('course-activity', 'Busca atividades por ID de curso matriculado')
  async findByCourseAndUser(
    @Param('course_id') courseId: string,
    @GetUser() user: User
  ): Promise<CourseActivity[]> {
    const courseExists = await this.courseRepositoryService.findOne({
      id: Number(courseId),
    });
    if (!courseExists) {
      throw new ConflictException('Curso não encontrado');
    }
    const isUserInCourse = await this.userCourseRepositoryService.findOne({
      user_id: user.id,
      course_id: courseExists.id,
    });
    if (!isUserInCourse) {
      throw new ConflictException('Usuário não está matriculado neste curso.');
    }
    return await this.courseActivityRepositoryService.find({ course_id: courseExists.id });
  }

  @Patch(':id')
  @AuthDecorator(true)
  @Decorator('course-activity', 'Atualiza atividade de curso por ID')
  async update(
    @Param('id') id: string,
    @Body() updateCourseActivityDto: UpdateCourseActivityDto
  ): Promise<CourseActivity | null> {
    const courseActivityExists = await this.courseActivityRepositoryService.findOne({
      id: +id,
    });
    if (!courseActivityExists) {
      throw new ConflictException('Atividade de curso não encontrada');
    }
    return await this.courseActivityService.update(
      courseActivityExists.id,
      updateCourseActivityDto
    );
  }

  @Delete(':id')
  @AuthDecorator(true)
  @Decorator('course-activity', 'Remove atvidade de curso por ID (softDelete)')
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    const courseActivityExists = await this.courseActivityRepositoryService.findOne({
      id: +id,
    });
    if (!courseActivityExists) {
      throw new ConflictException('Atividade de curso não encontrada');
    }
    const deleteResult = await this.courseActivityRepositoryService.remove(
      +courseActivityExists.id
    );
    if (deleteResult?.affected === 0) {
      throw new ConflictException('Erro ao excluir atividade de curso');
    }
    return deleteResult;
  }
}
