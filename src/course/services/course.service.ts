import { getEndDate, getStartDate } from '@/utils/utils.constants';
import { Injectable } from '@nestjs/common';
import { Between, In, Like } from 'typeorm';
import { Course } from '../entities/course.entity';
import { CourseRepositoryService } from './course.repository.service';
import { CourseOrder, CourseParams, CourseParamsFilter } from '../entities/course.interface';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { UserCourseRepositoryService } from '@/user-course/services/user-course.repository.service';

@Injectable()
export class CourseService {
  constructor(
    private readonly courseRepositoryService: CourseRepositoryService,
    private readonly userCourseRepositoryService: UserCourseRepositoryService
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const courseEntity = await this.courseRepositoryService.create(createCourseDto);
    await this.courseRepositoryService.save(courseEntity);
    if (!courseEntity.id) {
      return null;
    }
    return await this.courseRepositoryService.findOne({ id: courseEntity.id });
  }

  async update(id: number, upateCourseDto: UpdateCourseDto): Promise<Course> {
    const courseEntity = await this.courseRepositoryService.create(upateCourseDto);
    await this.courseRepositoryService.update(id, courseEntity);
    return await this.courseRepositoryService.findOne({ id });
  }

  async createFilters(params: CourseParamsFilter): Promise<CourseParams> {
    const filters: CourseParams = {};
    if (params.start_create_datetime && params.end_create_datetime) {
      const start = getStartDate(params.start_create_datetime.toString());
      const end = getEndDate(params.end_create_datetime.toString());
      filters.create_datetime = Between(start, end);
    }
    if (params.start_update_datetime && params.end_update_datetime) {
      const start = getStartDate(params.start_update_datetime.toString());
      const end = getEndDate(params.end_update_datetime.toString());
      filters.update_datetime = Between(start, end);
    }
    if (params.id?.length > 0) {
      filters.id = In(params.id);
    }
    if (params.name) {
      filters.name = Like(`%${params.name}%`);
    }
    if (params.section) {
      filters.section = Like(`%${params.section}%`);
    }
    if (params.duration) {
      filters.duration = Like(`%${params.duration}%`);
    }
    return filters;
  }

  async findByFilters(filters: CourseParams, order?: CourseOrder): Promise<Course[]> {
    return await this.courseRepositoryService.find(filters, order);
  }

  async findByFiltersPaged(
    skip: number,
    take: number,
    filters: CourseParams,
    order?: CourseOrder
  ): Promise<[Course[], number]> {
    return await this.courseRepositoryService.findPaged(skip, take, filters, order);
  }

  async findByUser(userId: number): Promise<Course[]> {
    const userCourses = await this.userCourseRepositoryService.find({
      user_id: userId,
    });
    const coursesIds = userCourses.map((item) => item.course_id);
    if (coursesIds.length === 0) {
      return [];
    }
    return await this.courseRepositoryService.find({ id: In(coursesIds) });
  }
}
