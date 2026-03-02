import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GameService } from './game.service';
import { StartGameDto } from './dto/start-game.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { FinishGameDto } from './dto/finish-game.dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get(':code')
  getActivity(@Param('code') code: string) {
    return this.gameService.getActivityByCode(code);
  }

  @Post(':code/start')
  startGame(@Param('code') code: string, @Body() dto: StartGameDto) {
    return this.gameService.startGame(code, dto);
  }

  @Post('sessions/:sessionId/answer')
  submitAnswer(
    @Param('sessionId') sessionId: string,
    @Body() dto: SubmitAnswerDto,
  ) {
    return this.gameService.submitAnswer(sessionId, dto);
  }

  @Post('sessions/:sessionId/finish')
  finishGame(
    @Param('sessionId') sessionId: string,
    @Body() dto: FinishGameDto,
  ) {
    return this.gameService.finishGame(sessionId, dto);
  }
}
