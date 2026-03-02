import { IsString, IsOptional, IsInt, Min, MinLength } from 'class-validator';

export class UpdateQuestionDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  order?: number;

  @IsString()
  @MinLength(1)
  @IsOptional()
  answer?: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  example?: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  question?: string;

  @IsString()
  @IsOptional()
  hint?: string;
}
