import { IsInt, Min } from 'class-validator';

export class FinishGameDto {
  @IsInt()
  @Min(0)
  timeUsed: number;

  @IsInt()
  @Min(0)
  score: number;
}
