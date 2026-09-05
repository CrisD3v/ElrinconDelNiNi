import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ReportCommentDto {
  @ApiPropertyOptional({ description: 'Reason for reporting', example: 'spam' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  reason?: string;
}
