import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateUserCourseActivityDto } from '../dto/create-user-course-activity.dto';
import { UpdateUserCourseActivityDto } from '../dto/update-user-course-activity.dto';
import { UserCourseActivity } from '../entities/user-course-activity.entity';
import {
  UserCourseActivityParams,
  UserCourseActivityOrder,
} from '../entities/user-course-activity.interface';
import { getFolderPath } from '@/utils/utils.constants';

@Injectable()
export class UserCourseActivityRepositoryService {
  constructor(
    @InjectRepository(UserCourseActivity)
    private readonly userCourseActivityRepository: Repository<UserCourseActivity>
  ) {}

  async create(
    userCourseActivityDto: CreateUserCourseActivityDto | UpdateUserCourseActivityDto,
    file: Express.Multer.File
  ): Promise<UserCourseActivity> {
    return this.userCourseActivityRepository.create({
      ...userCourseActivityDto,
      file_upload: file ? file.filename : undefined,
      file_path: file ? getFolderPath('user-course-activity') : undefined,
    });
  }

  async save(userCourseActivity: UserCourseActivity): Promise<UserCourseActivity> {
    return await this.userCourseActivityRepository.save(userCourseActivity);
  }

  async findOne(
    params?: UserCourseActivityParams | UserCourseActivityParams[]
  ): Promise<UserCourseActivity> {
    if (!params) {
      return null;
    }
    return await this.userCourseActivityRepository.findOne({ where: params });
  }

  async find(
    params?: UserCourseActivityParams | UserCourseActivityParams[],
    order?: UserCourseActivityOrder
  ): Promise<UserCourseActivity[]> {
    if (params) {
      if (order) {
        return await this.userCourseActivityRepository.find({ where: params, order });
      }
      return await this.userCourseActivityRepository.find({ where: params });
    }
    if (order) {
      return await this.userCourseActivityRepository.find({ order });
    }
    return await this.userCourseActivityRepository.find();
  }

  async findPaged(
    skip: number,
    take: number,
    params?: UserCourseActivityParams,
    order?: UserCourseActivityOrder
  ): Promise<[UserCourseActivity[], number]> {
    if (params) {
      if (order) {
        return await this.userCourseActivityRepository.findAndCount({
          where: params,
          skip: skip * take,
          take,
          order,
        });
      }
      return await this.userCourseActivityRepository.findAndCount({
        where: params,
        skip: skip * take,
        take,
      });
    }
    if (order) {
      return await this.userCourseActivityRepository.findAndCount({
        skip: skip * take,
        take,
        order,
      });
    }
    return await this.userCourseActivityRepository.findAndCount({ skip: skip * take, take });
  }

  async update(id: number, userCourseActivity: UserCourseActivity): Promise<UpdateResult> {
    if (!id) {
      return null;
    }
    return await this.userCourseActivityRepository.update(id, userCourseActivity);
  }

  async remove(id: number): Promise<DeleteResult> {
    if (!id) {
      return null;
    }
    return await this.userCourseActivityRepository.softDelete(id);
  }
}
