import { FindOperator, FindOptionsOrderValue } from 'typeorm';

export interface CourseParams {
  id?: number | FindOperator<number>;
  name?: string | FindOperator<string>;
  section?: string | FindOperator<string>;
  duration?: string | FindOperator<string>;
  create_datetime?: Date | FindOperator<Date>;
  update_datetime?: Date | FindOperator<Date>;
}

export interface CourseOrder {
  id?: FindOptionsOrderValue;
  name?: FindOptionsOrderValue;
  section?: FindOptionsOrderValue;
  duration?: FindOptionsOrderValue;
  create_datetime?: FindOptionsOrderValue;
  update_datetime?: FindOptionsOrderValue;
}

export interface CourseParamsFilter {
  id?: number[];
  name?: string;
  section?: string;
  duration?: string;
  start_create_datetime?: string;
  end_create_datetime?: string;
  start_update_datetime?: string;
  end_update_datetime?: string;
}
