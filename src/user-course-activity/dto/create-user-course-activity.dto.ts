import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserCourseActivityDto {
  @ApiProperty({
    description: 'ID do curso',
    type: 'number',
    default: 0,
  })
  @IsNotEmpty()
  course_id: number;

  @ApiProperty({
    description: 'ID da atividade do curso',
    type: 'number',
    default: 0,
  })
  @IsNotEmpty()
  course_activity_id: number;

  @ApiHideProperty()
  @IsOptional()
  user_id: number;

  @ApiProperty({
    description: 'Entrega de atividade',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  file: string;
}
