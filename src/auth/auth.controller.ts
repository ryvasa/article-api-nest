import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from './authenticated.guard';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { GoogleAuthGuard } from './utils/google/google-auth.guard';
import { LocalAuthGuard } from './utils/local/local-auth.guard';
import { UsersService } from 'src/users/users.service';
import { FacebookAuthGuard } from './utils/facebook/facebook-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { createWriteStream } from 'fs';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file) {
    const ws = createWriteStream(`uploads/${file.originalname}`);
    ws.write(file.buffer);
  }

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
  googleRedirect(@Res() res) {
    return res.redirect('http://localhost:5173/');
  }

  @Get('facebook')
  @UseGuards(FacebookAuthGuard)
  facebookHandler() {
    return { msg: 'facebook auth' };
  }

  @Get('facebook/redirect')
  @UseGuards(FacebookAuthGuard)
  facebookRedirect(@Request() req) {
    return req.user;
  }
}
