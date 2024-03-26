import { getEndDate, getStartDate, isANumber } from '@/utils/utils.constants';
import { Injectable } from '@nestjs/common';
import { Between, In, Like } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserRepositoryService } from './user.repository.service';
import { UserOrder, UserParams, UserParamsFilter } from '../entities/user.interface';
import { UserOrderColumnException, UserOrderValue } from '../entities/user.enum';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CourseService } from '@/course/services/course.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  private readonly url: string;

  constructor(
    private readonly userRepositoryService: UserRepositoryService,
    private readonly courseService: CourseService,
    private readonly configService: ConfigService
  ) {
    this.url = this.configService.get<string>('URL');
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userEntity = await this.userRepositoryService.create(createUserDto);
    await this.userRepositoryService.save(userEntity);
    const user = userEntity?.id
      ? await this.userRepositoryService.findOne({ id: userEntity.id })
      : null;
    return await this.userInfo(user);
  }

  async update(id: number, upateUserDto: UpdateUserDto): Promise<User> {
    const userEntity = await this.userRepositoryService.create(upateUserDto);
    await this.userRepositoryService.update(id, userEntity);
    const user = await this.userRepositoryService.findOne({ id });
    return await this.userInfo(user);
  }

  async createFilters(params: UserParamsFilter): Promise<UserParams> {
    const filters: UserParams = {};
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
    if (params.first_name) {
      filters.first_name = Like(`%${params.first_name}%`);
    }
    if (params.last_name) {
      filters.last_name = Like(`%${params.last_name}%`);
    }
    if (params.email) {
      filters.email = Like(`%${params.email}%`);
    }
    if (params.role) {
      filters.role = Like(`%${params.role}%`);
    }
    return filters;
  }

  async findByFilters(filters: UserParams, order?: UserOrder): Promise<User[]> {
    const users = await this.userRepositoryService.find(filters, order);
    const result: User[] = [];
    for (const user of users) {
      const userInfo = await this.userInfo(user);
      result.push(userInfo);
    }
    return result;
  }

  async findByFiltersPaged(
    skip: number,
    take: number,
    filters: UserParams,
    order?: UserOrder
  ): Promise<[User[], number]> {
    const users = await this.userRepositoryService.findPaged(skip, take, filters, order);
    for (let user of users[0]) {
      user = await this.userInfo(user);
    }
    return users;
  }

  async findUserIdsBySearch(search: string): Promise<number[]> {
    const result: number[] = [];
    const usersBySearch = await this.userRepositoryService.find([
      { id: isANumber(search) ? +search : null },
      { first_name: Like(`%${search}%`) },
      { last_name: Like(`%${search}%`) },
    ]);
    for (const user of usersBySearch) {
      result.push(user.id);
    }
    return result;
  }

  async findOneInfo(id: number): Promise<User> {
    const user = await this.userRepositoryService.findOne({ id });
    if (!user) {
      return null;
    }
    return await this.userInfo(user);
  }

  async userInfo(user: User): Promise<User> {
    delete user.password;
    user.url = user.file_upload ? this.url + '/' + user.file_path : null;
    return user;
  }

  async findOneUserWithCourses(id: number): Promise<User> {
    const user = await this.findOneInfo(id);
    if (user) {
      user.course = await this.courseService.findByUser(id);
    }
    return user;
  }

  async orderExceptionFunction(
    users: User[],
    orderColumn: string,
    orderValue: string
  ): Promise<User[]> {
    if (!users || users?.length === 0) {
      return [];
    }
    if (orderColumn === UserOrderColumnException.FRIST_NAME) {
      if (orderValue === UserOrderValue.asc || orderValue === UserOrderValue.ASC) {
        return await this.orderUsersByFirstNameAsc(users);
      }
      if (orderValue === UserOrderValue.desc || orderValue === UserOrderValue.DESC) {
        return await this.orderUsersByFirstNameAsc(users);
      }
    }
    if (orderColumn === UserOrderColumnException.LAST_NAME) {
      if (orderValue === UserOrderValue.asc || orderValue === UserOrderValue.ASC) {
        return await this.orderUsersByLastNameAsc(users);
      }
      if (orderValue === UserOrderValue.desc || orderValue === UserOrderValue.DESC) {
        return await this.orderUsersByLastNameAsc(users);
      }
    }
    return users;
  }

  async orderUsersByFirstNameAsc(users: User[]): Promise<User[]> {
    return users.sort(function (a: User, b: User): number {
      if (a.first_name > b.first_name) {
        return 1;
      }
      if (a.first_name < b.first_name) {
        return -1;
      }
      if (a.first_name === b.first_name) {
        if (a.id >= b.id) {
          return 1;
        }
        if (a.id < b.id) {
          return -1;
        }
      }
      return 1;
    });
  }

  async orderUsersByFirstNameDesc(users: User[]): Promise<User[]> {
    return users.sort(function (a: User, b: User): number {
      if (a.first_name > b.first_name) {
        return -1;
      }
      if (a.first_name < b.first_name) {
        return 1;
      }
      if (a.first_name === b.first_name) {
        if (a.id >= b.id) {
          return -1;
        }
        if (a.id < b.id) {
          return 1;
        }
      }
      return 1;
    });
  }

  async orderUsersByLastNameAsc(users: User[]): Promise<User[]> {
    return users.sort(function (a: User, b: User): number {
      if (a.last_name > b.last_name) {
        return 1;
      }
      if (a.last_name < b.last_name) {
        return -1;
      }
      if (a.last_name === b.last_name) {
        if (a.id >= b.id) {
          return 1;
        }
        if (a.id < b.id) {
          return -1;
        }
      }
      return 1;
    });
  }

  async orderUsersByLastNameDesc(users: User[]): Promise<User[]> {
    return users.sort(function (a: User, b: User): number {
      if (a.last_name > b.last_name) {
        return -1;
      }
      if (a.last_name < b.last_name) {
        return 1;
      }
      if (a.last_name === b.last_name) {
        if (a.id >= b.id) {
          return -1;
        }
        if (a.id < b.id) {
          return 1;
        }
      }
      return 1;
    });
  }
}
