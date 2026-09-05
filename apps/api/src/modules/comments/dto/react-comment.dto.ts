import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class ReactCommentDto {
  @ApiProperty({ description: 'Emoji to react with', example: 'fire' })
  @IsString()
  @MaxLength(10)
  emoji: string;
}
