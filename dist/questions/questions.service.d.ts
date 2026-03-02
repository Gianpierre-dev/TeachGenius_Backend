import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
export declare class QuestionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private validateActivityOwnership;
    create(activityId: string, teacherId: string, dto: CreateQuestionDto): Promise<{
        question: string;
        id: string;
        order: number;
        answer: string;
        example: string;
        hint: string | null;
        activityId: string;
    }>;
    update(id: string, teacherId: string, dto: UpdateQuestionDto): Promise<{
        question: string;
        id: string;
        order: number;
        answer: string;
        example: string;
        hint: string | null;
        activityId: string;
    }>;
    delete(id: string, teacherId: string): Promise<{
        message: string;
    }>;
}
