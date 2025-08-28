import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Full name of the customer',
    example: 'John Doe',
  })
  @IsNotEmpty({ message: 'Customer name is required' })
  @IsString({ message: 'Customer name must be a string' })
  name: string;

  @ApiProperty({
    description: 'Email address of the customer',
    example: 'johndoe@example.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    description: 'Phone number of the customer',
    example: '+8801712345678',
  })
  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString({ message: 'Phone number must be a string' })
  phone: string;

  @ApiPropertyOptional({
    description: 'Postal code of the customer address',
    example: '1207',
  })
  @IsOptional()
  @IsString({ message: 'Postal code must be a string' })
  postalCode?: string;

  @ApiProperty({
    description: 'Shipping address of the customer',
    example: '123 Main Street, Dhaka',
  })
  @IsNotEmpty({ message: 'Shipping address is required' })
  @IsString({ message: 'Shipping address must be a string' })
  shippingAddress: string;

  @ApiProperty({
    description: 'Billing address of the customer',
    example: '456 Business Road, Dhaka',
  })
  @IsNotEmpty({ message: 'Billing address is required' })
  @IsString({ message: 'Billing address must be a string' })
  billingAddress: string;
}
