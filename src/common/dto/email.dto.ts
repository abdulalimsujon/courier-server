import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export class EmailDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  @Length(5, 255, { message: 'Email must be between 5 and 255 characters' })
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: 'Email must be in a valid format',
  })
  email: string;
}
