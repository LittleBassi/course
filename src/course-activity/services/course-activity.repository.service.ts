import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateCourseActivityDto } from '../dto/create-course-activity.dto';
import { UpdateCourseActivityDto } from '../dto/update-course-activity.dto';
import { CourseActivity } from '../entities/course-activity.entity';
import { CourseActivityOrder, CourseActivityParams } from '../entities/course-activity.interface';

@Injectable()
export class CourseActivityRepositoryService {
  constructor(
    @InjectRepository(CourseActivity)
    private readonly courseActivityRepository: Repository<CourseActivity>
  ) {}

  async create(
    courseActivityDto: CreateCourseActivityDto | UpdateCourseActivityDto
  ): Promise<CourseActivity> {
    return this.courseActivityRepository.create(courseActivityDto);
  }

  async save(courseActivity: CourseActivity): Promise<CourseActivity> {
    return await this.courseActivityRepository.save(courseActivity);
  }

  async findOne(params?: CourseActivityParams | CourseActivityParams[]): Promise<CourseActivity> {
    if (!params) {
      return null;
    }
    return await this.courseActivityRepository.findOne({ where: params });
  }

  async find(
    params?: CourseActivityParams | CourseActivityParams[],
    order?: CourseActivityOrder
  ): Promise<CourseActivity[]> {
    if (params) {
      if (order) {
        return await this.courseActivityRepository.find({ where: params, order });
      }
      return await this.courseActivityRepository.find({ where: params });
    }
    if (order) {
      return await this.courseActivityRepository.find({ order });
    }
    return await this.courseActivityRepository.find();
  }

  async findPaged(
    skip: number,
    take: number,
    params?: CourseActivityParams,
    order?: CourseActivityOrder
  ): Promise<[CourseActivity[], number]> {
    if (params) {
      if (order) {
        return await this.courseActivityRepository.findAndCount({
          where: params,
          skip: skip * take,
          take,
          order,
        });
      }
      return await this.courseActivityRepository.findAndCount({
        where: params,
        skip: skip * take,
        take,
      });
    }
    if (order) {
      return await this.courseActivityRepository.findAndCount({
        skip: skip * take,
        take,
        order,
      });
    }
    return await this.courseActivityRepository.findAndCount({ skip: skip * take, take });
  }

  async update(id: number, courseActivity: CourseActivity): Promise<UpdateResult> {
    if (!id) {
      return null;
    }
    return await this.courseActivityRepository.update(id, courseActivity);
  }

  async remove(id: number): Promise<DeleteResult> {
    if (!id) {
      return null;
    }
    return await this.courseActivityRepository.softDelete(id);
  }
}
