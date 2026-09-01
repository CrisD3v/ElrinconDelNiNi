import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export enum SeriesLanguage {
  ES = 'es',
  EN = 'en',
}

export class SeriesQueryDto {
  @IsNotEmpty()
  @IsEnum(SeriesLanguage, { message: 'lang must be either es or en' })
  lang: SeriesLanguage;

  @IsOptional()
  title?: string;
  
  @IsOptional()
  limit?: number;
  
  @IsOptional()
  offset?: number;
}
