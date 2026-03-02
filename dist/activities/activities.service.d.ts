import { PrismaService } from '../prisma/prisma.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
export declare class ActivitiesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private generateCode;
    create(teacherId: string, dto: CreateActivityDto): Promise<{
        questions: {
            question: string;
            id: string;
            order: number;
            answer: string;
            example: string;
            hint: string | null;
            activityId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        timeLimit: number;
        isActive: boolean;
        code: string;
        updatedAt: Date;
        teacherId: string;
    }>;
    findAllByTeacher(teacherId: string): Promise<({
        _count: {
            questions: number;
            gameSessions: number;
        };
    } & {
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        timeLimit: number;
        isActive: boolean;
        code: string;
        updatedAt: Date;
        teacherId: string;
    })[]>;
    findById(id: string, teacherId?: string): Promise<{
        teacher: {
            name: string;
            id: string;
        };
        questions: {
            question: string;
            id: string;
            order: number;
            answer: string;
            example: string;
            hint: string | null;
            activityId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        timeLimit: number;
        isActive: boolean;
        code: string;
        updatedAt: Date;
        teacherId: string;
    }>;
    update(id: string, teacherId: string, dto: UpdateActivityDto): Promise<{
        questions: {
            question: string;
            id: string;
            order: number;
            answer: string;
            example: string;
            hint: string | null;
            activityId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        timeLimit: number;
        isActive: boolean;
        code: string;
        updatedAt: Date;
        teacherId: string;
    }>;
    delete(id: string, teacherId: string): Promise<{
        message: string;
    }>;
    getResults(id: string, teacherId: string): Promise<{
        id: string;
        studentName: string;
        startedAt: Date;
        finishedAt: Date | null;
        timeUsed: number | null;
        score: number;
        totalQuestions: number;
        percentage: number;
        answers: {
            id: string;
            questionOrder: number;
            correct: boolean;
            timeToAnswer: number | null;
            sessionId: string;
        }[];
    }[]>;
}
