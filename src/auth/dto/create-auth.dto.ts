import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({
    type: 'string',
    default: 'foo@example.com',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: 'string',
    default: '123456',
  })
  @IsNotEmpty()
  password: string;
}
