import { FindOperator, FindOptionsOrderValue } from 'typeorm';

export interface UserCourseActivityParams {
  id?: number | FindOperator<number>;
  course_id?: number | FindOperator<number>;
  course_activity_id?: number | FindOperator<number>;
  user_id?: number | FindOperator<number>;
  file_path?: string | FindOperator<string>;
  file_upload?: string | FindOperator<string>;
  create_datetime?: Date | FindOperator<Date>;
  update_datetime?: Date | FindOperator<Date>;
}

export interface UserCourseActivityOrder {
  id?: FindOptionsOrderValue;
  course_id?: FindOptionsOrderValue;
  course_activity_id?: FindOptionsOrderValue;
  user_id?: FindOptionsOrderValue;
  file_path?: FindOptionsOrderValue;
  file_upload?: FindOptionsOrderValue;
  create_datetime?: FindOptionsOrderValue;
  update_datetime?: FindOptionsOrderValue;
}

export interface UserCourseActivityParamsFilter {
  id?: number[];
  course_id?: number[];
  course_activity_id?: number[];
  user_id?: number[];
  file_path?: string;
  file_upload?: string;
  start_create_datetime?: string;
  end_create_datetime?: string;
  start_update_datetime?: string;
  end_update_datetime?: string;
}
