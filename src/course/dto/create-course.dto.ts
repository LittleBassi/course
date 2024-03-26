import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({
    description: 'Nome do curso',
    type: 'string',
    default: 'Curso',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Setor do curso',
    type: 'string',
    default: 'Setor',
  })
  @IsNotEmpty()
  section: string;

  @ApiProperty({
    description: 'Duração do curso',
    type: 'string',
    default: '00:00:00',
  })
  @IsNotEmpty()
  duration: string;
}
