import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TokenStatus } from '@prisma/client';

export class CreateTokenDto {
  @ApiProperty({
    description: 'Type of issue',
    example: 'PICKUP', // 👈 string, because your schema says `String`
  })
  @IsString()
  @IsNotEmpty()
  typeOfIssue: string;

  @ApiProperty({
    description: 'Detailed description of the issue',
    example: 'The delivery was delayed by 2 hours.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    enum: TokenStatus,
    description: 'Current status of the token',
    example: TokenStatus.OPEN,
  })
  @IsEnum(TokenStatus)
  Status: TokenStatus; // ✅ required
}
