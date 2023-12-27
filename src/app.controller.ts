import { Controller, Get, Req } from "@nestjs/common";
import { AppService } from './app.service';
import { Request } from "express";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/secret')
  getHello(@Req() req: Request): string {
    return this.appService.getHello(req);
  }
  @Get()
  getHelloWorld(){
    return this.appService.getHelloWorld();
  }
}
