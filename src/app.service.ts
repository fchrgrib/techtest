import { Injectable } from '@nestjs/common';
import { Request } from "express";

@Injectable()
export class AppService {
  getHelloWorld() {
    return 'Hello World';
  }
  getHello(req: Request): string {
    return `Hello ${req.cookies['token']}!`;
  }
}
