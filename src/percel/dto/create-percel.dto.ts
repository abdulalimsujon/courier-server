import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateParcelDto {
  @ApiProperty({
    description: 'Name of the parcel',
    example: 'Electronics Box',
  })
  @IsString({ message: 'Parcel name must be a string' })
  parcelName: string;

  @ApiProperty({
    description: 'Detailed description of the parcel',
    example: 'A package containing a laptop and accessories',
  })
  @IsString({ message: 'Description must be a string' })
  description: string;

  @ApiProperty({
    description: 'Delivery address of the parcel',
    example: '123 Main Street, Dhaka, Bangladesh',
  })
  @IsString({ message: 'Address must be a string' })
  address: string;

  @ApiProperty({
    description: 'Invoice number (optional)',
    example: 'INV-2025-001',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Invoice must be a string' })
  invoice?: string;

  @ApiProperty({
    description: 'Additional notes for the parcel',
    example: 'Handle with care',
  })
  @IsString({ message: 'Notes must be a string' })
  notes: string;

  @ApiProperty({
    description: 'Height of the parcel in cm',
    example: 25,
    default: 0,
  })
  @IsInt({ message: 'Height must be an integer' })
  @Min(0, { message: 'Height must be a positive number' })
  height: number;

  @ApiProperty({
    description: 'Weight of the parcel in grams',
    example: 1500,
    default: 0,
  })
  @IsInt({ message: 'Weight must be an integer' })
  @Min(0, { message: 'Weight must be a positive number' })
  weight: number;

  @ApiProperty({
    description: 'Length of the parcel in cm',
    example: 40,
    default: 0,
  })
  @IsInt({ message: 'Length must be an integer' })
  @Min(0, { message: 'Length must be a positive number' })
  length: number;

  @ApiProperty({
    description: 'ID of the customer this parcel belongs to',
    example: 1,
  })
  @IsInt({ message: 'Customer ID must be an integer' })
  customerId: number;
}
