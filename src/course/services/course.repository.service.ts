import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { Course } from '../entities/course.entity';
import { CourseOrder, CourseParams } from '../entities/course.interface';

@Injectable()
export class CourseRepositoryService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>
  ) {}

  async create(courseDto: CreateCourseDto | UpdateCourseDto): Promise<Course> {
    return this.courseRepository.create(courseDto);
  }

  async save(course: Course): Promise<Course> {
    return await this.courseRepository.save(course);
  }

  async findOne(params?: CourseParams | CourseParams[]): Promise<Course> {
    if (!params) {
      return null;
    }
    return await this.courseRepository.findOne({ where: params });
  }

  async find(params?: CourseParams | CourseParams[], order?: CourseOrder): Promise<Course[]> {
    if (params) {
      if (order) {
        return await this.courseRepository.find({ where: params, order });
      }
      return await this.courseRepository.find({ where: params });
    }
    if (order) {
      return await this.courseRepository.find({ order });
    }
    return await this.courseRepository.find();
  }

  async findPaged(
    skip: number,
    take: number,
    params?: CourseParams,
    order?: CourseOrder
  ): Promise<[Course[], number]> {
    if (params) {
      if (order) {
        return await this.courseRepository.findAndCount({
          where: params,
          skip: skip * take,
          take,
          order,
        });
      }
      return await this.courseRepository.findAndCount({
        where: params,
        skip: skip * take,
        take,
      });
    }
    if (order) {
      return await this.courseRepository.findAndCount({
        skip: skip * take,
        take,
        order,
      });
    }
    return await this.courseRepository.findAndCount({ skip: skip * take, take });
  }

  async update(id: number, course: Course): Promise<UpdateResult> {
    if (!id) {
      return null;
    }
    return await this.courseRepository.update(id, course);
  }

  async remove(id: number): Promise<DeleteResult> {
    if (!id) {
      return null;
    }
    return await this.courseRepository.softDelete(id);
  }
}
