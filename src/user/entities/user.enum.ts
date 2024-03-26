export enum UserOrderColumn {
  id = 'id',
  first_name = 'first_name',
  last_name = 'last_name',
  email = 'email',
  role = 'role',
  create_datetime = 'create_datetime',
  update_datetime = 'update_datetime',
}

export enum UserOrderValue {
  asc = 'asc',
  ASC = 'ASC',
  desc = 'desc',
  DESC = 'DESC',
}

export enum UserOrderColumnException {
  FRIST_NAME = 'first_name',
  LAST_NAME = 'last_name',
}

export enum UserRoleEnum {
  ADMIN = 'admin',
  COMMON = 'common',
}
