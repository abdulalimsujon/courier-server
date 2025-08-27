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
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber(undefined) // accepts any region
  phone: string;

  @IsOptional()
  @IsString()
  businessName?: string | null;

  @IsOptional()
  @IsString()
  address?: string | null;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
