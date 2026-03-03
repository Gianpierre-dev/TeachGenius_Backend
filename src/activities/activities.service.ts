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

  async create(profesorId: string, dto: CreateActivityDto) {
    let codigo: string;
    let esUnico = false;

    while (!esUnico) {
      codigo = this.generateCode();
      const existente = await this.prisma.actividad.findUnique({
        where: { codigo },
      });
      if (!existente) esUnico = true;
    }

    const actividad = await this.prisma.actividad.create({
      data: {
        codigo: codigo!,
        titulo: dto.title,
        descripcion: dto.description,
        tiempoLimite: dto.timeLimit ?? 600,
        profesorId,
        preguntas: {
          create: dto.questions.map((q) => ({
            orden: q.order,
            respuesta: q.answer.toUpperCase(),
            ejemplo: q.example,
            pregunta: q.question,
            pista: q.hint,
          })),
        },
      },
      include: {
        preguntas: {
          orderBy: { orden: 'asc' },
        },
      },
    });

    return this.mapActivityToResponse(actividad);
  }

  async findAllByTeacher(profesorId: string) {
    const actividades = await this.prisma.actividad.findMany({
      where: { profesorId },
      include: {
        _count: {
          select: {
            preguntas: true,
            sesionesJuego: true,
          },
        },
      },
      orderBy: { creadoEn: 'desc' },
    });

    return actividades.map((a) => ({
      id: a.id,
      code: a.codigo,
      title: a.titulo,
      description: a.descripcion,
      timeLimit: a.tiempoLimite,
      isActive: a.activa,
      createdAt: a.creadoEn,
      _count: {
        questions: a._count.preguntas,
        gameSessions: a._count.sesionesJuego,
      },
    }));
  }

  async findById(id: string, profesorId?: string) {
    const actividad = await this.prisma.actividad.findUnique({
      where: { id },
      include: {
        preguntas: {
          orderBy: { orden: 'asc' },
        },
        profesor: {
          select: { id: true, nombre: true },
        },
      },
    });

    if (!actividad) {
      throw new NotFoundException('Actividad no encontrada');
    }

    if (profesorId && actividad.profesorId !== profesorId) {
      throw new ForbiddenException('Acceso denegado');
    }

    return this.mapActivityToResponse(actividad);
  }

  async update(id: string, profesorId: string, dto: UpdateActivityDto) {
    await this.findById(id, profesorId);

    // Usar transacción para actualizar actividad y preguntas
    const actividad = await this.prisma.$transaction(async (tx) => {
      // Actualizar datos básicos de la actividad
      const actividadActualizada = await tx.actividad.update({
        where: { id },
        data: {
          titulo: dto.title,
          descripcion: dto.description,
          tiempoLimite: dto.timeLimit,
          activa: dto.isActive,
        },
      });

      // Si se enviaron preguntas, procesarlas
      if (dto.questions && dto.questions.length > 0) {
        // Obtener IDs de preguntas existentes
        const preguntasExistentes = await tx.pregunta.findMany({
          where: { actividadId: id },
          select: { id: true },
        });
        const idsExistentes = new Set(preguntasExistentes.map((p) => p.id));

        // IDs de preguntas que vienen en el DTO
        const idsEnDto = new Set(
          dto.questions.filter((q) => q.id).map((q) => q.id),
        );

        // Eliminar preguntas que ya no están en el DTO
        const idsAEliminar = [...idsExistentes].filter(
          (id) => !idsEnDto.has(id),
        );
        if (idsAEliminar.length > 0) {
          await tx.pregunta.deleteMany({
            where: { id: { in: idsAEliminar } },
          });
        }

        // Actualizar o crear preguntas
        for (const q of dto.questions) {
          if (q.id && idsExistentes.has(q.id)) {
            // Actualizar pregunta existente
            await tx.pregunta.update({
              where: { id: q.id },
              data: {
                orden: q.order,
                respuesta: q.answer.toUpperCase(),
                ejemplo: q.example,
                pregunta: q.question,
                pista: q.hint,
              },
            });
          } else {
            // Crear nueva pregunta
            await tx.pregunta.create({
              data: {
                orden: q.order,
                respuesta: q.answer.toUpperCase(),
                ejemplo: q.example,
                pregunta: q.question,
                pista: q.hint,
                actividadId: id,
              },
            });
          }
        }
      }

      // Retornar actividad con preguntas actualizadas
      return tx.actividad.findUnique({
        where: { id },
        include: {
          preguntas: {
            orderBy: { orden: 'asc' },
          },
        },
      });
    });

    return this.mapActivityToResponse(actividad);
  }

  async delete(id: string, profesorId: string) {
    await this.findById(id, profesorId);

    await this.prisma.actividad.delete({
      where: { id },
    });

    return { message: 'Actividad eliminada correctamente' };
  }

  async getResults(id: string, profesorId: string) {
    await this.findById(id, profesorId);

    const sesiones = await this.prisma.sesionJuego.findMany({
      where: { actividadId: id },
      include: {
        respuestas: {
          orderBy: { ordenPregunta: 'asc' },
        },
      },
      orderBy: { iniciadoEn: 'desc' },
    });

    return sesiones.map((sesion) => ({
      id: sesion.id,
      studentName: sesion.nombreAlumno,
      startedAt: sesion.iniciadoEn,
      finishedAt: sesion.finalizadoEn,
      timeUsed: sesion.tiempoUsado,
      score: sesion.puntaje,
      totalQuestions: sesion.totalPreguntas,
      percentage: Math.round((sesion.puntaje / sesion.totalPreguntas) * 100),
      answers: sesion.respuestas.map((r) => ({
        id: r.id,
        questionOrder: r.ordenPregunta,
        correct: r.correcta,
        timeToAnswer: r.tiempoRespuesta,
      })),
    }));
  }

  private mapActivityToResponse(actividad: any) {
    return {
      id: actividad.id,
      code: actividad.codigo,
      title: actividad.titulo,
      description: actividad.descripcion,
      timeLimit: actividad.tiempoLimite,
      isActive: actividad.activa,
      createdAt: actividad.creadoEn,
      updatedAt: actividad.actualizadoEn,
      questions: actividad.preguntas?.map((p: any) => ({
        id: p.id,
        order: p.orden,
        answer: p.respuesta,
        example: p.ejemplo,
        question: p.pregunta,
        hint: p.pista,
      })),
      teacher: actividad.profesor
        ? {
            id: actividad.profesor.id,
            name: actividad.profesor.nombre,
          }
        : undefined,
    };
  }
}
