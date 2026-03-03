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
    actividadId: string,
    profesorId: string,
  ) {
    const actividad = await this.prisma.actividad.findUnique({
      where: { id: actividadId },
    });

    if (!actividad) {
      throw new NotFoundException('Actividad no encontrada');
    }

    if (actividad.profesorId !== profesorId) {
      throw new ForbiddenException('Acceso denegado');
    }

    return actividad;
  }

  async create(actividadId: string, profesorId: string, dto: CreateQuestionDto) {
    await this.validateActivityOwnership(actividadId, profesorId);

    const pregunta = await this.prisma.pregunta.create({
      data: {
        orden: dto.order,
        respuesta: dto.answer.toUpperCase(),
        ejemplo: dto.example,
        pregunta: dto.question,
        pista: dto.hint,
        actividadId,
      },
    });

    return {
      id: pregunta.id,
      order: pregunta.orden,
      answer: pregunta.respuesta,
      example: pregunta.ejemplo,
      question: pregunta.pregunta,
      hint: pregunta.pista,
    };
  }

  async update(id: string, profesorId: string, dto: UpdateQuestionDto) {
    const pregunta = await this.prisma.pregunta.findUnique({
      where: { id },
      include: { actividad: true },
    });

    if (!pregunta) {
      throw new NotFoundException('Pregunta no encontrada');
    }

    if (pregunta.actividad.profesorId !== profesorId) {
      throw new ForbiddenException('Acceso denegado');
    }

    const actualizada = await this.prisma.pregunta.update({
      where: { id },
      data: {
        orden: dto.order,
        respuesta: dto.answer ? dto.answer.toUpperCase() : undefined,
        ejemplo: dto.example,
        pregunta: dto.question,
        pista: dto.hint,
      },
    });

    return {
      id: actualizada.id,
      order: actualizada.orden,
      answer: actualizada.respuesta,
      example: actualizada.ejemplo,
      question: actualizada.pregunta,
      hint: actualizada.pista,
    };
  }

  async delete(id: string, profesorId: string) {
    const pregunta = await this.prisma.pregunta.findUnique({
      where: { id },
      include: { actividad: true },
    });

    if (!pregunta) {
      throw new NotFoundException('Pregunta no encontrada');
    }

    if (pregunta.actividad.profesorId !== profesorId) {
      throw new ForbiddenException('Acceso denegado');
    }

    await this.prisma.pregunta.delete({
      where: { id },
    });

    return { message: 'Pregunta eliminada correctamente' };
  }
}
