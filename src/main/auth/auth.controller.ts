import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user-dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user and return JWT token' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: {
        success: true,
        message: 'Login successful',
        data: {
          access_token: 'eyJhbGciOiJIUzI1NiIs...',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
  })
  @UseGuards(AuthGuard('local'))
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    const token = await this.authService.signIn(email, password);

    return {
      success: true,
      message: 'Login successful',
      data: token,
    };
  }

  // 👇 REGISTER ENDPOINT
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  async register(@Body() createUserDto: CreateUserDto) {
    console.log('this is from registratiom auth', createUserDto);
    const user = await this.authService.register({
      ...createUserDto,
      role: 'MERCHANT',
    });

    return {
      success: true,
      message: 'User registered successfully',
      data: user,
    };
  }
}
