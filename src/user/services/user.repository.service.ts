import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { UserOrder, UserParams } from '../entities/user.interface';
import * as fs from 'fs';
import { getAvatarFolderPath, getFileExtension } from '@/utils/utils.constants';

@Injectable()
export class UserRepositoryService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(userDto: CreateUserDto | UpdateUserDto): Promise<User> {
    return this.userRepository.create({
      ...userDto,
      password: userDto.password || undefined,
    });
  }

  async save(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async findOne(params?: UserParams | UserParams[]): Promise<User> {
    if (!params) {
      return null;
    }
    return await this.userRepository.findOne({ where: params });
  }

  async find(params?: UserParams | UserParams[], order?: UserOrder): Promise<User[]> {
    if (params) {
      if (order) {
        return await this.userRepository.find({ where: params, order });
      }
      return await this.userRepository.find({ where: params });
    }
    if (order) {
      return await this.userRepository.find({ order });
    }
    return await this.userRepository.find();
  }

  async findPaged(
    skip: number,
    take: number,
    params?: UserParams,
    order?: UserOrder
  ): Promise<[User[], number]> {
    if (params) {
      if (order) {
        return await this.userRepository.findAndCount({
          where: params,
          skip: skip * take,
          take,
          order,
        });
      }
      return await this.userRepository.findAndCount({
        where: params,
        skip: skip * take,
        take,
      });
    }
    if (order) {
      return await this.userRepository.findAndCount({
        skip: skip * take,
        take,
        order,
      });
    }
    return await this.userRepository.findAndCount({ skip: skip * take, take });
  }

  async update(id: number, user: User): Promise<UpdateResult> {
    if (!id) {
      return null;
    }
    return await this.userRepository.update(id, user);
  }

  async updateAvatar(user: User, url: string): Promise<UpdateResult> {
    if (!user?.id) {
      return null;
    }
    const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e9);
    const fileExtension = getFileExtension(url);
    const fileName = user.first_name + '-' + String(uniqueSuffix) + '.' + fileExtension;
    const filePath = getAvatarFolderPath(fileName);
    fs.writeFileSync(`uploads/${filePath}`, url);
    delete user.password;
    delete user.url;
    user.file_path = filePath;
    user.file_upload = fileName;
    await this.update(user.id, user);
  }

  async remove(id: number): Promise<DeleteResult> {
    if (!id) {
      return null;
    }
    return await this.userRepository.softDelete(id);
  }
}
