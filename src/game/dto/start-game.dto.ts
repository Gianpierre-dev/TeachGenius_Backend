import { IsString, MinLength } from 'class-validator';

export class StartGameDto {
  @IsString()
  @MinLength(1)
  studentName: string;
}
