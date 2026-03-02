import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeachersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.teacher.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        _count: {
          select: { activities: true },
        },
      },
    });
  }
}
