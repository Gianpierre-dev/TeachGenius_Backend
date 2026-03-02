import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StartGameDto } from './dto/start-game.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { FinishGameDto } from './dto/finish-game.dto';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}

  async getActivityByCode(code: string) {
    const activity = await this.prisma.activity.findUnique({
      where: { code: code.toUpperCase() },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            order: true,
            answer: true,
            example: true,
            question: true,
            hint: true,
          },
        },
        teacher: {
          select: { name: true },
        },
      },
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    if (!activity.isActive) {
      throw new BadRequestException('This activity is not active');
    }

    return {
      id: activity.id,
      code: activity.code,
      title: activity.title,
      description: activity.description,
      timeLimit: activity.timeLimit,
      teacherName: activity.teacher.name,
      questions: activity.questions,
    };
  }

  async startGame(code: string, dto: StartGameDto) {
    const activity = await this.prisma.activity.findUnique({
      where: { code: code.toUpperCase() },
      include: {
        questions: true,
      },
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    if (!activity.isActive) {
      throw new BadRequestException('This activity is not active');
    }

    const session = await this.prisma.gameSession.create({
      data: {
        studentName: dto.studentName,
        totalQuestions: activity.questions.length,
        activityId: activity.id,
      },
    });

    return {
      sessionId: session.id,
      startedAt: session.startedAt,
    };
  }

  async submitAnswer(sessionId: string, dto: SubmitAnswerDto) {
    const session = await this.prisma.gameSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Game session not found');
    }

    if (session.finishedAt) {
      throw new BadRequestException('Game session already finished');
    }

    const existingAnswer = await this.prisma.studentAnswer.findFirst({
      where: {
        sessionId,
        questionOrder: dto.questionOrder,
      },
    });

    if (existingAnswer) {
      throw new BadRequestException(
        'Answer already submitted for this question',
      );
    }

    const answer = await this.prisma.studentAnswer.create({
      data: {
        questionOrder: dto.questionOrder,
        correct: dto.correct,
        timeToAnswer: dto.timeToAnswer,
        sessionId,
      },
    });

    return answer;
  }

  async finishGame(sessionId: string, dto: FinishGameDto) {
    const session = await this.prisma.gameSession.findUnique({
      where: { id: sessionId },
      include: {
        answers: true,
      },
    });

    if (!session) {
      throw new NotFoundException('Game session not found');
    }

    if (session.finishedAt) {
      throw new BadRequestException('Game session already finished');
    }

    const correctAnswers = session.answers.filter((a) => a.correct).length;

    const updatedSession = await this.prisma.gameSession.update({
      where: { id: sessionId },
      data: {
        finishedAt: new Date(),
        timeUsed: dto.timeUsed,
        score: correctAnswers,
      },
    });

    return {
      id: updatedSession.id,
      studentName: updatedSession.studentName,
      score: correctAnswers,
      totalQuestions: updatedSession.totalQuestions,
      percentage: Math.round(
        (correctAnswers / updatedSession.totalQuestions) * 100,
      ),
      timeUsed: updatedSession.timeUsed,
      finishedAt: updatedSession.finishedAt,
    };
  }
}
