import { Injectable, NestMiddleware } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import * as process from "process";
import { Request, Response } from "express";

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    try {
      const token = req.cookies['token'];
      if (token === '')
        return res.status(401).send({
          statusCode: 401,
          message: 'token empty',
          status: 'Not Authorized',
        });
      jwt.verify(token, process.env.JWT_KEY);
      next();
    } catch (e) {
      return res.status(401).send({
        statusCode: 401,
        message: 'token invalid',
        status: 'Not Authorized',
      });
    }
  }
}
