/* eslint-disable prettier/prettier */
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { databaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user-dto';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: databaseService) {}

  async user(email: string): Promise<User | null> {
  

    return this.databaseService.user.findUnique({
      where: { email },
    });
  }

  

async createUser(data: CreateUserDto) {
  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // eslint-disable-next-line no-useless-catch
  try {
    return await this.databaseService.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  } catch (error) {
 
    throw error;
  }
}


  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.databaseService.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.databaseService.user.delete({
      where,
    });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.databaseService.user.findUnique({
      where: {
        email,
      },
    });
  }
  async findOneById(id: number) {
    return this.databaseService.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    });
  }
}
