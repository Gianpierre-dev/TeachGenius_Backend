import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  private generateCode(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let code = '';
    for (let i = 0; i < 3; i++) {
      code += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    code += '-';
    for (let i = 0; i < 3; i++) {
      code += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return code;
  }

  async create(teacherId: string, dto: CreateActivityDto) {
    let code: string;
    let isUnique = false;

    while (!isUnique) {
      code = this.generateCode();
      const existing = await this.prisma.activity.findUnique({
        where: { code },
      });
      if (!existing) isUnique = true;
    }

    return this.prisma.activity.create({
      data: {
        code: code!,
        title: dto.title,
        description: dto.description,
        timeLimit: dto.timeLimit ?? 600,
        teacherId,
        questions: {
          create: dto.questions.map((q) => ({
            order: q.order,
            answer: q.answer.toUpperCase(),
            example: q.example,
            question: q.question,
            hint: q.hint,
          })),
        },
      },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async findAllByTeacher(teacherId: string) {
    return this.prisma.activity.findMany({
      where: { teacherId },
      include: {
        _count: {
          select: {
            questions: true,
            gameSessions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, teacherId?: string) {
    const activity = await this.prisma.activity.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
        teacher: {
          select: { id: true, name: true },
        },
      },
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    if (teacherId && activity.teacherId !== teacherId) {
      throw new ForbiddenException('Access denied');
    }

    return activity;
  }

  async update(id: string, teacherId: string, dto: UpdateActivityDto) {
    await this.findById(id, teacherId);

    return this.prisma.activity.update({
      where: { id },
      data: dto,
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async delete(id: string, teacherId: string) {
    await this.findById(id, teacherId);

    await this.prisma.activity.delete({
      where: { id },
    });

    return { message: 'Activity deleted successfully' };
  }

  async getResults(id: string, teacherId: string) {
    await this.findById(id, teacherId);

    const sessions = await this.prisma.gameSession.findMany({
      where: { activityId: id },
      include: {
        answers: {
          orderBy: { questionOrder: 'asc' },
        },
      },
      orderBy: { startedAt: 'desc' },
    });

    return sessions.map((session) => ({
      id: session.id,
      studentName: session.studentName,
      startedAt: session.startedAt,
      finishedAt: session.finishedAt,
      timeUsed: session.timeUsed,
      score: session.score,
      totalQuestions: session.totalQuestions,
      percentage: Math.round((session.score / session.totalQuestions) * 100),
      answers: session.answers,
    }));
  }
}
