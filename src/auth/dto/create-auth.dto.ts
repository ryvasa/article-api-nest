import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
  @ApiProperty()
  googleId?: string;

  @ApiProperty()
  facebookId?: string;
}
