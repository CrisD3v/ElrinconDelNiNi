import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'The text content of the comment',
    example: 'This chapter was amazing!',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  content: string;

  @ApiPropertyOptional({
    description: 'The ID of the manga this comment is attached to (if commenting on a series)',
    example: 'f9c33607-9180-4ba6-b85c-e4b5faee7192',
  })
  @IsOptional()
  @IsString()
  mangaId?: string;

  @ApiPropertyOptional({
    description: 'The ID of the chapter this comment is attached to (if commenting on a specific chapter)',
    example: 'c1234567-89ab-cdef-0123-456789abcdef',
  })
  @IsOptional()
  @IsString()
  chapterId?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'An optional image attached to the comment (max 5MB)',
  })
  @IsOptional()
  image?: any;
}
