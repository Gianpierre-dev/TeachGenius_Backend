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
    const profesorExistente = await this.prisma.profesor.findUnique({
      where: { email: dto.email },
    });

    if (profesorExistente) {
      throw new ConflictException('Email ya registrado');
    }

    const contrasenaHash = await bcrypt.hash(dto.password, 10);

    const profesor = await this.prisma.profesor.create({
      data: {
        email: dto.email,
        contrasena: contrasenaHash,
        nombre: dto.name,
      },
    });

    const token = this.generateToken(profesor.id);

    return {
      token,
      teacher: {
        id: profesor.id,
        email: profesor.email,
        name: profesor.nombre,
      },
    };
  }

  async login(dto: LoginDto) {
    const profesor = await this.prisma.profesor.findUnique({
      where: { email: dto.email },
    });

    if (!profesor) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const contrasenaValida = await bcrypt.compare(
      dto.password,
      profesor.contrasena,
    );

    if (!contrasenaValida) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const token = this.generateToken(profesor.id);

    return {
      token,
      teacher: {
        id: profesor.id,
        email: profesor.email,
        name: profesor.nombre,
      },
    };
  }

  async validateTeacher(id: string) {
    const profesor = await this.prisma.profesor.findUnique({
      where: { id },
    });

    if (!profesor) {
      throw new UnauthorizedException('Profesor no encontrado');
    }

    return profesor;
  }

  private generateToken(profesorId: string): string {
    return this.jwtService.sign({ sub: profesorId });
  }
}
