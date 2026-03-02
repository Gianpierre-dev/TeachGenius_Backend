import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingTeacher = await this.prisma.teacher.findUnique({
      where: { email: dto.email },
    });

    if (existingTeacher) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const teacher = await this.prisma.teacher.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
      },
    });

    const token = this.generateToken(teacher.id);

    return {
      token,
      teacher: {
        id: teacher.id,
        email: teacher.email,
        name: teacher.name,
      },
    };
  }

  async login(dto: LoginDto) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { email: dto.email },
    });

    if (!teacher) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      teacher.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(teacher.id);

    return {
      token,
      teacher: {
        id: teacher.id,
        email: teacher.email,
        name: teacher.name,
      },
    };
  }

  async validateTeacher(id: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
    });

    if (!teacher) {
      throw new UnauthorizedException('Teacher not found');
    }

    return teacher;
  }

  private generateToken(teacherId: string): string {
    return this.jwtService.sign({ sub: teacherId });
  }
}
