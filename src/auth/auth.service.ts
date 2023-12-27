import { HttpStatus, Injectable, Res } from "@nestjs/common";
import { PrismaService } from '../prisma/prisma.service';
import { Login, User } from "./dto/create-auth.dto";
import bcrypt from 'bcrypt';
import { Response } from "express";
import jwt from "jsonwebtoken";
import * as process from "process";


@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(res: Response,user: User){
    try {
      const password = await bcrypt.hash(user.password, 10);
      await this.prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: password,
        },
      });
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        status: 'error',
        message: 'Internal Server Error',
      });
    }

    return res.status(200).send({
      statusCode: 200,
      status: 'ok',
      message: 'successfully register',
    });
  }

  async login(userLogin: Login, res: Response) {
    try {
      const isEmailExists = await this.prisma.user.findFirst({
        where: { email: userLogin.email },
      });
      if (!isEmailExists)
        return res.status(HttpStatus.BAD_REQUEST).send({
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Email didn't exists",
          status: 'Bad Request',
        });

      const isPasswordMatch = await comparePasswords(userLogin.password, isEmailExists.password);

      if (!isPasswordMatch)
        return res.status(HttpStatus.BAD_REQUEST).send({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Wrong Password',
          status: 'Bad Request',
        });

      const encode = jwt.sign(
        {
          email: isEmailExists.email,
          name: isEmailExists.name,
        },
        process.env.JWT_KEY || '',
      );
      res.cookie('token', encode, {
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
        httpOnly: false,
        path: '/',
        domain: 'localhost',
      });
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        status: 'Internal Server Error',
        message: 'Internal Server Error',
      });
    }

    return res.status(200).send({
      statusCode: 200,
      status: 'ok',
      message: 'successfully login',
    });
  }

  logout(res: Response){
    res.clearCookie('token')
    return res.status(200).send({
      statusCode: 200,
      status: 'ok',
      message: 'successfully logout',
    });
  }
}

async function comparePasswords(plainText:string, hashed:string) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainText, hashed, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}
