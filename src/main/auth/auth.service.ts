import {
  Injectable,
  UnauthorizedException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { UserService } from 'src/main/user/user.service';
import { databaseService } from 'src/database/database.service';
import { CreateUserDto } from '../user/dto/create-user-dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly databaseService: databaseService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{
    access_token: string;
    id: number;
    name: string;
    email: string;
  }> {
    const user: User | null = await this.usersService.findOneByEmail(email); // ✅ unified

    if (!user || !user.password) {
      this.logger.warn(`Failed login attempt: email=${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      this.logger.warn(`Failed login attempt: email=${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      id: user.id,
      name: user.username,
      email: user.email,
      access_token: accessToken,
    };
  }

  async register(data: CreateUserDto) {
    const existingUser = await this.databaseService.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email is already registered');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await this.databaseService.user.create({
      data: {
        ...data,
        role: 'MERCHANT',
        password: hashedPassword,
      },
    });
  }
}
