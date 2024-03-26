import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateUserCourseDto } from '../dto/create-user-course.dto';
import { UpdateUserCourseDto } from '../dto/update-user-course.dto';
import { UserCourse } from '../entities/user-course.entity';
import { UserCourseParams, UserCourseOrder } from '../entities/user-course.interface';

@Injectable()
export class UserCourseRepositoryService {
  constructor(
    @InjectRepository(UserCourse)
    private readonly userCourseRepository: Repository<UserCourse>
  ) {}

  async create(userCourseDto: CreateUserCourseDto | UpdateUserCourseDto): Promise<UserCourse> {
    return this.userCourseRepository.create(userCourseDto);
  }

  async save(userCourse: UserCourse): Promise<UserCourse> {
    return await this.userCourseRepository.save(userCourse);
  }

  async findOne(params?: UserCourseParams | UserCourseParams[]): Promise<UserCourse> {
    if (!params) {
      return null;
    }
    return await this.userCourseRepository.findOne({ where: params });
  }

  async find(
    params?: UserCourseParams | UserCourseParams[],
    order?: UserCourseOrder
  ): Promise<UserCourse[]> {
    if (params) {
      if (order) {
        return await this.userCourseRepository.find({ where: params, order });
      }
      return await this.userCourseRepository.find({ where: params });
    }
    if (order) {
      return await this.userCourseRepository.find({ order });
    }
    return await this.userCourseRepository.find();
  }

  async findPaged(
    skip: number,
    take: number,
    params?: UserCourseParams,
    order?: UserCourseOrder
  ): Promise<[UserCourse[], number]> {
    if (params) {
      if (order) {
        return await this.userCourseRepository.findAndCount({
          where: params,
          skip: skip * take,
          take,
          order,
        });
      }
      return await this.userCourseRepository.findAndCount({
        where: params,
        skip: skip * take,
        take,
      });
    }
    if (order) {
      return await this.userCourseRepository.findAndCount({
        skip: skip * take,
        take,
        order,
      });
    }
    return await this.userCourseRepository.findAndCount({ skip: skip * take, take });
  }

  async update(id: number, userCourse: UserCourse): Promise<UpdateResult> {
    if (!id) {
      return null;
    }
    return await this.userCourseRepository.update(id, userCourse);
  }

  async remove(id: number): Promise<DeleteResult> {
    if (!id) {
      return null;
    }
    return await this.userCourseRepository.softDelete(id);
  }
}
