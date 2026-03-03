import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeachersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const profesor = await this.prisma.profesor.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nombre: true,
        creadoEn: true,
        _count: {
          select: { actividades: true },
        },
      },
    });

    if (!profesor) return null;

    return {
      id: profesor.id,
      email: profesor.email,
      name: profesor.nombre,
      createdAt: profesor.creadoEn,
      _count: {
        activities: profesor._count.actividades,
      },
    };
  }
}
