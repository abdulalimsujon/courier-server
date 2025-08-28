import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  MinLength,
  IsPhoneNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({
    description: 'Unique username of the user',
    example: 'john_doe',
  })
  @IsString({ message: 'Username must be a string' })
  username: string;

  @ApiProperty({
    description: 'Valid email address of the user',
    example: 'john@example.com',
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty({
    description: 'Phone number in international format',
    example: '+8801712345678',
  })
  @IsPhoneNumber(undefined, {
    message: 'Phone number must be a valid international number',
  })
  phone: string;

  @ApiPropertyOptional({
    description: 'Business name if applicable',
    example: 'Tech Solutions Ltd.',
  })
  @IsOptional()
  @IsString({ message: 'Business name must be a string' })
  businessName?: string | null;

  @ApiPropertyOptional({
    description: 'Residential or business address',
    example: '123 Main Street, Dhaka',
  })
  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  address?: string | null;

  @ApiProperty({
    description: 'Password for the account (min 6 characters)',
    example: 'securePassword123',
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, {
    message: 'Password must be at least 6 characters long',
  })
  password: string;

  @ApiPropertyOptional({
    description: 'Role of the user',
    enum: UserRole,
    example: UserRole.CUSTOMER,
  })
  @IsOptional()
  @IsEnum(UserRole, {
    message: `Role must be a valid user role: ${Object.values(UserRole).join(
      ', ',
    )}`,
  })
  role?: UserRole;
}
