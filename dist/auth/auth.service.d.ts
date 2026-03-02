import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        token: string;
        teacher: {
            id: string;
            email: string;
            name: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
        teacher: {
            id: string;
            email: string;
            name: string;
        };
    }>;
    validateTeacher(id: string): Promise<{
        email: string;
        password: string;
        name: string;
        id: string;
        createdAt: Date;
    }>;
    private generateToken;
}
