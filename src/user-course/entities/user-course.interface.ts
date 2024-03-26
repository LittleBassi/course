import { FindOperator, FindOptionsOrderValue } from 'typeorm';

export interface UserCourseParams {
  id?: number | FindOperator<number>;
  course_id?: number | FindOperator<number>;
  user_id?: number | FindOperator<number>;
  create_datetime?: Date | FindOperator<Date>;
  update_datetime?: Date | FindOperator<Date>;
}

export interface UserCourseOrder {
  id?: FindOptionsOrderValue;
  course_id?: FindOptionsOrderValue;
  user_id?: FindOptionsOrderValue;
  create_datetime?: FindOptionsOrderValue;
  update_datetime?: FindOptionsOrderValue;
}

export interface UserCourseParamsFilter {
  id?: number[];
  course_id?: number[];
  user_id?: number[];
  start_create_datetime?: string;
  end_create_datetime?: string;
  start_update_datetime?: string;
  end_update_datetime?: string;
}
