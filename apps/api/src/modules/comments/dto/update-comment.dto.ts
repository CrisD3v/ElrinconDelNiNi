import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateCommentDto {
  @ApiPropertyOptional({
    description: 'Updated text content of the comment',
    example: 'This chapter was amazing!',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  content?: string;

  @ApiPropertyOptional({
    description: 'Mark or unmark the comment as a spoiler',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isSpoiler?: boolean;
}
