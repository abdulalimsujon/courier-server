import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  MinLength,
  IsPhoneNumber,
} from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @IsString({ message: 'Username must be a string' })
  username: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsPhoneNumber(undefined, {
    message: 'Phone number must be a valid international number',
  })
  phone: string;

  @IsOptional()
  @IsString({ message: 'Business name must be a string' })
  businessName?: string | null;

  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  address?: string | null;

  @IsString({ message: 'Password must be a string' })
  @MinLength(6, {
    message: 'Password must be at least 6 characters long',
  })
  password: string;

  @IsOptional()
  @IsEnum(UserRole, {
    message: `Role must be a valid user role: ${Object.values(UserRole).join(
      ', ',
    )}`,
  })
  role?: UserRole;
}
