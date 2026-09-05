import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class LikeCommentDto {
  @ApiProperty({ description: '+1 for like, -1 for dislike', example: 1 })
  @IsInt()
  @Min(-1)
  @Max(1)
  @Transform(({ value }) => parseInt(value, 10))
  value: 1 | -1;
}
