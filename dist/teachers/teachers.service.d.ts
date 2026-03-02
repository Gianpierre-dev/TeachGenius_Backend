import { PrismaService } from '../prisma/prisma.service';
export declare class TeachersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<{
        email: string;
        name: string;
        id: string;
        createdAt: Date;
        _count: {
            activities: number;
        };
    } | null>;
}
