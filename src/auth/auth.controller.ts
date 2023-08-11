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
import { LocalAuthGuard } from './local-auth.guard';
import { AuthenticatedGuard } from './authenticated.guard';
import { LoginUserDto } from 'src/users/dto/login-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
