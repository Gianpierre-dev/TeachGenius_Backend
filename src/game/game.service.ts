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

  async getActivityByCode(codigo: string) {
    const actividad = await this.prisma.actividad.findUnique({
      where: { codigo: codigo.toUpperCase() },
      include: {
        preguntas: {
          orderBy: { orden: 'asc' },
          select: {
            id: true,
            orden: true,
            respuesta: true,
            ejemplo: true,
            pregunta: true,
            pista: true,
          },
        },
        profesor: {
          select: { nombre: true },
        },
      },
    });

    if (!actividad) {
      throw new NotFoundException('Actividad no encontrada');
    }

    if (!actividad.activa) {
      throw new BadRequestException('Esta actividad no está activa');
    }

    return {
      id: actividad.id,
      code: actividad.codigo,
      title: actividad.titulo,
      description: actividad.descripcion,
      timeLimit: actividad.tiempoLimite,
      teacherName: actividad.profesor.nombre,
      questions: actividad.preguntas.map((p) => ({
        id: p.id,
        order: p.orden,
        answer: p.respuesta,
        example: p.ejemplo,
        question: p.pregunta,
        hint: p.pista,
      })),
    };
  }

  async startGame(codigo: string, dto: StartGameDto) {
    const actividad = await this.prisma.actividad.findUnique({
      where: { codigo: codigo.toUpperCase() },
      include: {
        preguntas: true,
      },
    });

    if (!actividad) {
      throw new NotFoundException('Actividad no encontrada');
    }

    if (!actividad.activa) {
      throw new BadRequestException('Esta actividad no está activa');
    }

    const sesion = await this.prisma.sesionJuego.create({
      data: {
        nombreAlumno: dto.studentName,
        totalPreguntas: actividad.preguntas.length,
        actividadId: actividad.id,
      },
    });

    return {
      sessionId: sesion.id,
      startedAt: sesion.iniciadoEn,
    };
  }

  async submitAnswer(sesionId: string, dto: SubmitAnswerDto) {
    const sesion = await this.prisma.sesionJuego.findUnique({
      where: { id: sesionId },
    });

    if (!sesion) {
      throw new NotFoundException('Sesión de juego no encontrada');
    }

    if (sesion.finalizadoEn) {
      throw new BadRequestException('La sesión de juego ya finalizó');
    }

    const respuestaExistente = await this.prisma.respuestaAlumno.findFirst({
      where: {
        sesionId,
        ordenPregunta: dto.questionOrder,
      },
    });

    if (respuestaExistente) {
      throw new BadRequestException(
        'Ya se envió una respuesta para esta pregunta',
      );
    }

    const respuesta = await this.prisma.respuestaAlumno.create({
      data: {
        ordenPregunta: dto.questionOrder,
        correcta: dto.correct,
        tiempoRespuesta: dto.timeToAnswer,
        sesionId,
      },
    });

    return {
      id: respuesta.id,
      questionOrder: respuesta.ordenPregunta,
      correct: respuesta.correcta,
      timeToAnswer: respuesta.tiempoRespuesta,
    };
  }

  async finishGame(sesionId: string, dto: FinishGameDto) {
    const sesion = await this.prisma.sesionJuego.findUnique({
      where: { id: sesionId },
      include: {
        respuestas: true,
      },
    });

    if (!sesion) {
      throw new NotFoundException('Sesión de juego no encontrada');
    }

    if (sesion.finalizadoEn) {
      throw new BadRequestException('La sesión de juego ya finalizó');
    }

    const respuestasCorrectas = sesion.respuestas.filter((r) => r.correcta).length;

    const sesionActualizada = await this.prisma.sesionJuego.update({
      where: { id: sesionId },
      data: {
        finalizadoEn: new Date(),
        tiempoUsado: dto.timeUsed,
        puntaje: respuestasCorrectas,
      },
    });

    return {
      id: sesionActualizada.id,
      studentName: sesionActualizada.nombreAlumno,
      score: respuestasCorrectas,
      totalQuestions: sesionActualizada.totalPreguntas,
      percentage: Math.round(
        (respuestasCorrectas / sesionActualizada.totalPreguntas) * 100,
      ),
      timeUsed: sesionActualizada.tiempoUsado,
      finishedAt: sesionActualizada.finalizadoEn,
    };
  }
}
