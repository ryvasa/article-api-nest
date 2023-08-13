import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsAlphanumeric()
  @MaxLength(50)
  name: string;

  @ApiProperty()
  @MaxLength(225)
  email: string;

  @ApiProperty()
  @MinLength(8)
  password?: string;

  @ApiProperty()
  authId?: number;
}
