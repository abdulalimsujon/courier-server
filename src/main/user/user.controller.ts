/* eslint-disable @typescript-eslint/no-unused-vars */

import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma, User } from '@prisma/client';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user-dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    schema: {
      example: {
        success: true,
        message: 'User created successfully',
        data: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'MERCHANT',
        },
      },
    },
  })
  async create(@Body() data: CreateUserDto): Promise<{
    success: boolean;
    message: string;
    data: Omit<User, 'password'>;
  }> {
    const user = await this.userService.createUser(data);

    const { password, ...result } = user;

    return {
      success: true,
      message: 'User created successfully',
      data: result,
    };
  }
}
