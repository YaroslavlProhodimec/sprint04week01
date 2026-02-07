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
        blogs: 'GET/POST /blogs, GET/PUT/DELETE /blogs/:id',
        posts: 'GET/POST /posts, GET/PUT/DELETE /posts/:id',
        users: 'GET/POST /users, DELETE /users/:id',
        testing: 'DELETE /testing/all-data'
      }
    });
  }

  @Get('api')
  getApi(@Res() res: Response) {
    return res.json({
      message: 'API root',
      try: 'http://localhost:3001/ or http://localhost:3001/blogs'
    });
  }
}
