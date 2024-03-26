import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { RegressUserData } from '../entities/regress.interface';

@Injectable()
export class RegressService {
  private readonly axios: AxiosInstance;
  private readonly url: string;

  constructor() {
    this.url = `https://reqres.in/api/`;

    this.axios = axios.create({
      baseURL: this.url,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }

  async findSingleUser(id: string): Promise<RegressUserData> {
    try {
      const response = await this.axios.get(`/users/${id}`);
      return response.data?.data as RegressUserData;
    } catch (error) {
      console.error('REGRESS | SINGLE USER:', error.response?.data);
      return null;
    }
  }
}
