import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty({ message: 'Customer name is required' })
  @IsString({ message: 'Customer name must be a string' })
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString({ message: 'Phone number must be a string' })
  phone: string;

  @IsOptional()
  @IsString({ message: 'Postal code must be a string' })
  postalCode?: string;

  @IsNotEmpty({ message: 'Shipping address is required' })
  @IsString({ message: 'Shipping address must be a string' })
  shippingAddress: string;

  @IsNotEmpty({ message: 'Billing address is required' })
  @IsString({ message: 'Billing address must be a string' })
  billingAddress: string;
}
