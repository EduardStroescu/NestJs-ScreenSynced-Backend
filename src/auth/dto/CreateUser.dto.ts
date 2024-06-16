import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    description:
      'Used for login and profile display(if no displayName is provided)',
    minLength: 8,
    maxLength: 20,
  })
  @IsNotEmpty()
  userName: string;

  @ApiProperty({
    type: String,
    description: 'Password',
    minLength: 5,
    maxLength: 20,
    format: 'password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({
    type: String,
    description:
      'Displayed in the user profile if provided, otherwise userName will be used',
    minLength: 8,
    maxLength: 20,
  })
  @IsString()
  @IsOptional()
  displayName?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'base64',
    description: 'Base64 encoded avatar image file (optional)',
  })
  @IsOptional()
  avatar?: string;
}
