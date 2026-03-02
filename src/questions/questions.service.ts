import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService) {}

  private async validateActivityOwnership(
    activityId: string,
    teacherId: string,
  ) {
    const activity = await this.prisma.activity.findUnique({
      where: { id: activityId },
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    if (activity.teacherId !== teacherId) {
      throw new ForbiddenException('Access denied');
    }

    return activity;
  }

  async create(activityId: string, teacherId: string, dto: CreateQuestionDto) {
    await this.validateActivityOwnership(activityId, teacherId);

    return this.prisma.question.create({
      data: {
        ...dto,
        answer: dto.answer.toUpperCase(),
        activityId,
      },
    });
  }

  async update(id: string, teacherId: string, dto: UpdateQuestionDto) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: { activity: true },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    if (question.activity.teacherId !== teacherId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.question.update({
      where: { id },
      data: {
        ...dto,
        answer: dto.answer ? dto.answer.toUpperCase() : undefined,
      },
    });
  }

  async delete(id: string, teacherId: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: { activity: true },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    if (question.activity.teacherId !== teacherId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.question.delete({
      where: { id },
    });

    return { message: 'Question deleted successfully' };
  }
}
