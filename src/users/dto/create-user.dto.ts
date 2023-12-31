import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { MaxLength, MinLength } from 'class-validator';
import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';

export class CreateUserDto {
  @ApiProperty()
  @MaxLength(50)
  name: string;

  @ApiProperty()
  @MaxLength(225)
  email: string;

  @ApiProperty()
  @MinLength(8)
  password?: string;

  @ApiProperty()
  photo: string;

  @ApiProperty()
  @Type(() => CreateAuthDto)
  @Expose()
  auth?: CreateAuthDto;
}
