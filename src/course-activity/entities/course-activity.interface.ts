import { FindOperator, FindOptionsOrderValue } from 'typeorm';

export interface CourseActivityParams {
  id?: number | FindOperator<number>;
  course_id?: number | FindOperator<number>;
  name?: string | FindOperator<string>;
  value?: number | FindOperator<number>;
  create_datetime?: Date | FindOperator<Date>;
  update_datetime?: Date | FindOperator<Date>;
}

export interface CourseActivityOrder {
  id?: FindOptionsOrderValue;
  course_id?: FindOptionsOrderValue;
  name?: FindOptionsOrderValue;
  value?: FindOptionsOrderValue;
  create_datetime?: FindOptionsOrderValue;
  update_datetime?: FindOptionsOrderValue;
}

export interface CourseActivityParamsFilter {
  id?: number[];
  course_id?: number[];
  name?: string;
  value?: number;
  start_create_datetime?: string;
  end_create_datetime?: string;
  start_update_datetime?: string;
  end_update_datetime?: string;
}
