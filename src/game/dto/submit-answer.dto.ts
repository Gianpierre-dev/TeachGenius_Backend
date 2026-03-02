import { IsInt, IsBoolean, Min, IsOptional } from 'class-validator';

export class SubmitAnswerDto {
  @IsInt()
  @Min(1)
  questionOrder: number;

  @IsBoolean()
  correct: boolean;

  @IsInt()
  @Min(0)
  @IsOptional()
  timeToAnswer?: number;
}
