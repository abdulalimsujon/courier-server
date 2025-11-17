import * as bcrypt from 'bcrypt';
import { Inject, Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { databaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user-dto';
import { FindUserQueryDto } from 'src/common/dto/find-user-query-dto';
import { PaginatedResponse } from 'src/common/interface/pagination-response-interface';

@Injectable()
export class UserService {

  private  UserListChacheKeys : Set<string> = new Set();
  constructor(private readonly databaseService: databaseService,
  //  @Inject(CACHE_MANAGER)  private cacheManager:Cache,
  ) {}

  async user(email: string): Promise<User | null> {
    return this.databaseService.user.findUnique({
      where: { email },
    });
  }

  async createUser(data: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await this.databaseService.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  private generateUserListChahe(query:FindUserQueryDto ) {
    
    const {page =1,limit =2,username} = query;
    return `posts_list_page${page}_limit${limit}_username${username}`


  }
  // async allUsers(query:FindUserQueryDto): Promise<PaginatedResponse<User>> {
    
  //   const chacheKey = this.generateUserListChahe(query);

  //   this.UserListChacheKeys.add(chacheKey);

  //   // const getChacheData = await this.cacheManager.get<PaginatedResponse<User>>(chacheKey)

  //   return await this.databaseService.user.findMany({});
  // }
  // async updateUser(params: {
  //   where: Prisma.UserWhereUniqueInput;
  //   data: Prisma.UserUpdateInput;
  // }): Promise<User> {
  //   const { where, data } = params;
  //   return this.databaseService.user.update({
  //     data,
  //     where,
  //   });
  // }

  async allUsers() {
    return await this.databaseService.user.findMany({});
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
