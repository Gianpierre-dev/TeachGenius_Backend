import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsBoolean,
  MinLength,
} from 'class-validator';

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
}
