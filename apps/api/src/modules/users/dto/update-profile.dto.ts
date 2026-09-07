import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, Matches } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: 'The display name of the user',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  displayName?: string;

  @ApiPropertyOptional({
    description: 'A unique username without spaces',
    example: 'crisd3v',
  })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Username must contain only letters, numbers, and underscores' })
  username?: string;

  @ApiPropertyOptional({
    description: 'A short description or bio for the user profile',
    example: 'Avid manga reader and reviewer',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Profile image file (max 5MB)',
  })
  @IsOptional()
  profileImage?: any;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Banner image file (max 5MB)',
  })
  @IsOptional()
  bannerImage?: any;

  @ApiPropertyOptional({
    type: 'string',
    description: 'Flag to remove the banner image',
    example: 'true',
  })
  @IsOptional()
  removeBanner?: string | boolean;

  @ApiPropertyOptional({
    type: 'string',
    description: 'Flag to remove the profile image',
    example: 'true',
  })
  @IsOptional()
  removeProfileImage?: string | boolean;
}
