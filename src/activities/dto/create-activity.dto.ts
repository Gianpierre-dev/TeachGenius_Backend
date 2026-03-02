import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsArray,
  ValidateNested,
  MinLength,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

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

export class CreateActivityDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(60)
  @Max(3600)
  @IsOptional()
  timeLimit?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  @ArrayMinSize(1)
  questions: CreateQuestionDto[];
}
