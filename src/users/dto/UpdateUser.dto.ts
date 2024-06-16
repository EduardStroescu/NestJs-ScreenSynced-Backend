import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    type: String,
    description:
      'Will be used for user login and profile display(if no displayName is provided)',
  })
  @IsOptional()
  @IsString()
  userName?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Will be displayed in the user profile if provided',
  })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'New Password',
  })
  @IsOptional()
  @IsString()
  password?: string;
}

export class UpdateAvatarDto {
  @ApiProperty({
    type: 'string',
    format: 'base64',
    description: 'Base64 encoded avatar image file (required)',
  })
  @IsNotEmpty()
  avatar: string;
}
