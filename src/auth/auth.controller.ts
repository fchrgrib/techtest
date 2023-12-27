import { Controller, Post, Body, Res, Get, Delete } from "@nestjs/common";
import { AuthService } from './auth.service';
import { Response } from 'express';
import { Login, User } from './dto/create-auth.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() user: User, @Res() res: Response) {
    return this.authService.register(res, user);
  }

  @Post('login')
  login(@Body() userLogin: Login, @Res() res: Response){
    return this.authService.login(userLogin, res);
  }

  @Delete('logout')
  logout(@Res() res: Response){
    return this.authService.logout(res);
  }
}
