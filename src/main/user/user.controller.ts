/* eslint-disable @typescript-eslint/no-unused-vars */

import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma, User } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(
    @Body() data: Prisma.UserCreateInput,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userService.createUser(data);

    const { password, ...result } = user;
    return result;
  }
}
