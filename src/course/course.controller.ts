import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AuthDecorator, Decorator } from '@/utils/utils.decorator';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import { CourseService } from './services/course.service';
import { CourseRepositoryService } from './services/course.repository.service';
import { createOrder, stringIdsToArray } from '@/utils/utils.constants';
import { DeleteResult } from 'typeorm';
import { ApiQuery } from '@nestjs/swagger';
import { CourseOrderColumn, CourseOrderValue } from './entities/course.enum';

@Controller('course')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly courseRepositoryService: CourseRepositoryService
  ) {}

  @Post()
  @AuthDecorator(true)
  @Decorator('course', 'Cria um novo curso')
  async create(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    const newCourse = await this.courseService.create(createCourseDto);
    if (!newCourse) {
      throw new ConflictException('Erro ao cadastrar curso');
    }
    return newCourse;
  }

  @Get()
  @AuthDecorator()
  @ApiQuery({ name: 'id', required: false })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'section', required: false })
  @ApiQuery({ name: 'duration', required: false })
  @ApiQuery({ name: 'start_create_datetime', required: false })
  @ApiQuery({ name: 'end_create_datetime', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'order_column', required: false })
  @ApiQuery({ name: 'order_value', required: false })
  @Decorator('course', 'Busca todos os cursos')
  async findAllWithFilters(
    @Query('id') id?: string,
    @Query('name') name?: string,
    @Query('section') section?: string,
    @Query('duration') duration?: string,
    @Query('start_create_datetime') startCreateDatetime?: string,
    @Query('end_create_datetime') endCreateDatetime?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('order_column') orderColumn?: string,
    @Query('order_value') orderValue?: string
  ): Promise<Course[] | [Course[], number]> {
    const filters = await this.courseService.createFilters({
      id: id ? stringIdsToArray(id) : null,
      name,
      section,
      duration,
      start_create_datetime: startCreateDatetime,
      end_create_datetime: endCreateDatetime,
    });
    if (!filters) {
      throw new ConflictException('Falha ao aplicar filtros');
    }
    let order = null;
    if (orderColumn && orderValue) {
      const orderParam = createOrder(orderColumn, orderValue, CourseOrderColumn, CourseOrderValue);
      order = orderParam;
    }
    if ((skip || +skip === 0) && take) {
      return await this.courseService.findByFiltersPaged(+skip, +take, filters, order);
    }
    return await this.courseService.findByFilters(filters, order);
  }

  @Get(':id')
  @AuthDecorator()
  @Decorator('course', 'Busca curso por ID')
  async findOne(@Param('id') id: string): Promise<Course> {
    const course = await this.courseRepositoryService.findOne({ id: +id });
    if (!course) {
      throw new ConflictException('Curso não encontrado');
    }
    return course;
  }

  @Patch(':id')
  @AuthDecorator(true)
  @Decorator('course', 'Atualiza curso por ID')
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto
  ): Promise<Course | null> {
    const courseExists = await this.courseRepositoryService.findOne({
      id: +id,
    });
    if (!courseExists) {
      throw new ConflictException('Curso não encontrado');
    }
    return await this.courseService.update(courseExists.id, updateCourseDto);
  }

  @Delete(':id')
  @AuthDecorator(true)
  @Decorator('course', 'Remove curso por ID (softDelete)')
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    const courseExists = await this.courseRepositoryService.findOne({
      id: +id,
    });
    if (!courseExists) {
      throw new ConflictException('Curso não encontrado');
    }
    const deleteResult = await this.courseRepositoryService.remove(+courseExists.id);
    if (deleteResult?.affected === 0) {
      throw new ConflictException('Erro ao excluir curso');
    }
    return deleteResult;
  }
}
