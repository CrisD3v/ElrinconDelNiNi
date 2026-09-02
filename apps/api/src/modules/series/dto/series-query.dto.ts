import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum SeriesLanguage {
  ES = 'es',
  EN = 'en',
}

export class SeriesQueryDto {
  @ApiProperty({ description: 'Language for series content', enum: SeriesLanguage, example: 'es' })
  @IsNotEmpty()
  @IsEnum(SeriesLanguage, { message: 'lang must be either es or en' })
  lang: SeriesLanguage;

  @ApiPropertyOptional({ description: 'Search title', example: 'Naruto' })
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Limit of results', example: 10 })
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ description: 'Offset of results', example: 0 })
  @IsOptional()
  offset?: number;
}
