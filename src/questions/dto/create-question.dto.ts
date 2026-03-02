import { IsString, IsOptional, IsInt, Min, MinLength } from 'class-validator';

export class CreateQuestionDto {
  @IsInt()
  @Min(1)
  order: number;

  @IsString()
  @MinLength(1)
  answer: string;

  @IsString()
  @MinLength(1)
  example: string;

  @IsString()
  @MinLength(1)
  question: string;

  @IsString()
  @IsOptional()
  hint?: string;
}
