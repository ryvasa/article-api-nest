import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from './authenticated.guard';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { GoogleAuthGuard } from './utils/google/google-auth.guard';
import { LocalAuthGuard } from './utils/local/local-auth.guard';
import { UsersService } from 'src/users/users.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto, @Request() req): any {
    return req.user;
  }

  @UseGuards(AuthenticatedGuard)
  @Get('me')
  me(@Request() req): string {
    return req.user;
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('logout')
  logout(@Request() req): object {
    return this.authService.logout(req);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleHandler() {
    return { msg: 'google auth' };
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  handleRedirect(@Request() req) {
    return req.user;
  }
  // @Get('google/redirect')
  // @UseGuards(GoogleAuthGuard)
  // async handleRedirect(
  //   @Request() req,
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updateUserDto: UpdateUserDto,
  // ) {
  //   console.log(req.user);

  //   return await this.userService.update(+id, updateUserDto);
  // }
}
