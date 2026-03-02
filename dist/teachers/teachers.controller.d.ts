import { TeachersService } from './teachers.service';
interface RequestWithTeacher extends Request {
    user: {
        id: string;
    };
}
export declare class TeachersController {
    private readonly teachersService;
    constructor(teachersService: TeachersService);
    getMe(req: RequestWithTeacher): Promise<{
        email: string;
        name: string;
        id: string;
        createdAt: Date;
        _count: {
            activities: number;
        };
    } | null>;
}
export {};
