import { Body, ConflictException, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AuthDecorator, Decorator } from '@/utils/utils.decorator';
import { DeleteResult } from 'typeorm';
import { UserCourseService } from './services/user-course.service';
import { UserCourseRepositoryService } from './services/user-course.repository.service';
import { CreateUserCourseDto } from './dto/create-user-course.dto';
import { UserCourse } from './entities/user-course.entity';
import { CourseRepositoryService } from '@/course/services/course.repository.service';
import { UserRepositoryService } from '@/user/services/user.repository.service';

@Controller('user-course')
export class UserCourseController {
  constructor(
    private readonly userCourseService: UserCourseService,
    private readonly userCourseRepositoryService: UserCourseRepositoryService,
    private readonly userRepositoryService: UserRepositoryService,
    private readonly courseRepositoryService: CourseRepositoryService
  ) {}

  @Post()
  @AuthDecorator(true)
  @Decorator('user-course', 'Cria uma nova matrícula')
  async create(@Body() createUserCourseDto: CreateUserCourseDto): Promise<UserCourse> {
    const courseExists = await this.courseRepositoryService.findOne({
      id: +createUserCourseDto.course_id,
    });
    if (!courseExists) {
      throw new ConflictException('Curso não encontrado');
    }
    const userExists = await this.userRepositoryService.findOne({
      id: +createUserCourseDto.user_id,
    });
    if (!userExists) {
      throw new ConflictException('Usuário não encontrado');
    }
    const isUserAlreadyInCourse = await this.userCourseRepositoryService.findOne({
      user_id: createUserCourseDto.user_id,
    });
    if (isUserAlreadyInCourse) {
      throw new ConflictException('Usuário já está matriculado em um curso.');
    }
    const newUserCourse = await this.userCourseService.create(createUserCourseDto);
    if (!newUserCourse) {
      throw new ConflictException('Erro ao matricular usuário em curso');
    }
    return newUserCourse;
  }

  @Get(':id')
  @AuthDecorator(true)
  @Decorator('user-course', 'Busca matrícula por ID')
  async findById(@Param('id') id: string): Promise<UserCourse> {
    const userCourseExists = await this.userCourseRepositoryService.findOne({
      id: +id,
    });
    if (!userCourseExists) {
      throw new ConflictException('Matrícula não encontrada');
    }
    return userCourseExists;
  }

  @Get('course/:course_id')
  @AuthDecorator(true)
  @Decorator('user-course', 'Busca matrículas por ID de curso')
  async findByCourse(@Param('course_id') courseId: string): Promise<UserCourse[]> {
    const courseExists = await this.courseRepositoryService.findOne({
      id: Number(courseId),
    });
    if (!courseExists) {
      throw new ConflictException('Curso não encontrado');
    }
    return await this.userCourseRepositoryService.find({ course_id: courseExists.id });
  }

  @Delete(':id')
  @AuthDecorator(true)
  @Decorator('user-course', 'Remove matrícula por ID (softDelete)')
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    const userCourseExists = await this.userCourseRepositoryService.findOne({
      id: +id,
    });
    if (!userCourseExists) {
      throw new ConflictException('Matrícula não encontrada');
    }
    const deleteResult = await this.userCourseRepositoryService.remove(+userCourseExists.id);
    if (deleteResult?.affected === 0) {
      throw new ConflictException('Erro ao excluir matrícula');
    }
    return deleteResult;
  }
}
