import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCourseActivityDto {
  @ApiProperty({
    description: 'ID do curso',
    type: 'number',
    default: 0,
  })
  @IsNotEmpty()
  course_id: number;

  @ApiProperty({
    description: 'Nome da atividade do curso',
    type: 'string',
    default: 'Atividade',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Valor da atividade do curso',
    type: 'number',
    default: 0,
  })
  @IsNotEmpty()
  value: number;
}
