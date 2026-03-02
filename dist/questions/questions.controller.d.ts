import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
interface RequestWithTeacher extends Request {
    user: {
        id: string;
    };
}
export declare class QuestionsController {
    private readonly questionsService;
    constructor(questionsService: QuestionsService);
    create(req: RequestWithTeacher, activityId: string, dto: CreateQuestionDto): Promise<{
        question: string;
        id: string;
        order: number;
        answer: string;
        example: string;
        hint: string | null;
        activityId: string;
    }>;
    update(req: RequestWithTeacher, id: string, dto: UpdateQuestionDto): Promise<{
        question: string;
        id: string;
        order: number;
        answer: string;
        example: string;
        hint: string | null;
        activityId: string;
    }>;
    delete(req: RequestWithTeacher, id: string): Promise<{
        message: string;
    }>;
}
export {};
