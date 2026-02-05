import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getRoot(@Res() res: Response) {
    return res.json({
      message: 'API is running',
      endpoints: {
        root: '/api',
        blogs: '/api/blogs',
        users: '/api/users'
      }
    });
  }

  @Get('api')
  getHello(): string {
    return this.appService.getHello();
  }
}
