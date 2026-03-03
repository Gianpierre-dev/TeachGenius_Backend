import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsBoolean,
  MinLength,
  IsArray,
  ValidateNested,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateQuestionDto {
  @IsString()
  @IsOptional()
  id?: string;

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

export class UpdateActivityDto {
  @IsString()
  @MinLength(1)
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(60)
  @Max(3600)
  @IsOptional()
  timeLimit?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateQuestionDto)
  @ArrayMaxSize(50)
  @IsOptional()
  questions?: UpdateQuestionDto[];
}
