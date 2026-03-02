import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
interface RequestWithTeacher extends Request {
    user: {
        id: string;
    };
}
export declare class ActivitiesController {
    private readonly activitiesService;
    constructor(activitiesService: ActivitiesService);
    create(req: RequestWithTeacher, dto: CreateActivityDto): Promise<{
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
    findAll(req: RequestWithTeacher): Promise<({
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
    findOne(req: RequestWithTeacher, id: string): Promise<{
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
    update(req: RequestWithTeacher, id: string, dto: UpdateActivityDto): Promise<{
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
    delete(req: RequestWithTeacher, id: string): Promise<{
        message: string;
    }>;
    getResults(req: RequestWithTeacher, id: string): Promise<{
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
export {};
