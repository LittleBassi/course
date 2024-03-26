import { FindOperator, FindOptionsOrderValue } from 'typeorm';

export interface UserParams {
  id?: number | FindOperator<number>;
  first_name?: string | FindOperator<string>;
  last_name?: string | FindOperator<string>;
  email?: string | FindOperator<string>;
  role?: string | FindOperator<string>;
  create_datetime?: Date | FindOperator<Date>;
  update_datetime?: Date | FindOperator<Date>;
}

export interface UserOrder {
  id?: FindOptionsOrderValue;
  first_name?: FindOptionsOrderValue;
  last_name?: FindOptionsOrderValue;
  email?: FindOptionsOrderValue;
  role?: FindOptionsOrderValue;
  create_datetime?: FindOptionsOrderValue;
  update_datetime?: FindOptionsOrderValue;
}

export interface UserParamsFilter {
  id?: number[];
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
  start_create_datetime?: string;
  end_create_datetime?: string;
  start_update_datetime?: string;
  end_update_datetime?: string;
}
