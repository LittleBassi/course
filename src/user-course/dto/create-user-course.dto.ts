import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserCourseDto {
  @ApiProperty({
    description: 'ID do curso',
    type: 'number',
    default: 0,
  })
  @IsNotEmpty()
  course_id: number;

  @ApiProperty({
    description: 'ID do usuário',
    type: 'number',
    default: 0,
  })
  @IsNotEmpty()
  user_id: number;
}
