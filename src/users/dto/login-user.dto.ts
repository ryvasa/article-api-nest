import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, MinLength } from 'class-validator';

export class LoginUserDto {
  @ApiProperty()
  @MaxLength(225)
  email: string;

  @ApiProperty()
  @MinLength(8)
  password: string;
}
