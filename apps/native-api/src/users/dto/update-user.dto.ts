import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;
}

export class ChangePasswordDto {
  @ApiPropertyOptional({ example: 'currentPassword123' })
  @IsString()
  currentPassword: string;

  @ApiPropertyOptional({ example: 'newSecurePassword456', minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  newPassword: string;
}

