import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

interface RequestWithTeacher extends Request {
  user: { id: string };
}

@Controller()
@UseGuards(JwtAuthGuard)
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post('activities/:activityId/questions')
  create(
    @Request() req: RequestWithTeacher,
    @Param('activityId') activityId: string,
    @Body() dto: CreateQuestionDto,
  ) {
    return this.questionsService.create(activityId, req.user.id, dto);
  }

  @Put('questions/:id')
  update(
    @Request() req: RequestWithTeacher,
    @Param('id') id: string,
    @Body() dto: UpdateQuestionDto,
  ) {
    return this.questionsService.update(id, req.user.id, dto);
  }

  @Delete('questions/:id')
  delete(@Request() req: RequestWithTeacher, @Param('id') id: string) {
    return this.questionsService.delete(id, req.user.id);
  }
}
