import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Primeiro nome',
    type: 'string',
    default: 'Foo',
  })
  @IsNotEmpty({ message: 'Primeiro nome deve ser preenchido' })
  first_name: string;

  @ApiProperty({
    description: 'Último nome',
    type: 'string',
    default: 'Example',
  })
  @IsNotEmpty({ message: 'Último nome deve ser preenchido' })
  last_name: string;

  @ApiProperty({
    description: 'Email do usuário',
    type: 'string',
    default: 'foo@example.com',
  })
  @IsEmail()
  @IsNotEmpty({ message: 'E-mail deve ser preenchido' })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    type: 'string',
    default: '123',
  })
  @IsNotEmpty({ message: 'Senha deve ser preenchida' })
  password: string;

  @ApiHideProperty()
  @IsOptional()
  role: string;
}
