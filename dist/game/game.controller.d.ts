import { GameService } from './game.service';
import { StartGameDto } from './dto/start-game.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { FinishGameDto } from './dto/finish-game.dto';
export declare class GameController {
    private readonly gameService;
    constructor(gameService: GameService);
    getActivity(code: string): Promise<{
        id: string;
        code: string;
        title: string;
        description: string | null;
        timeLimit: number;
        teacherName: string;
        questions: {
            question: string;
            id: string;
            order: number;
            answer: string;
            example: string;
            hint: string | null;
        }[];
    }>;
    startGame(code: string, dto: StartGameDto): Promise<{
        sessionId: string;
        startedAt: Date;
    }>;
    submitAnswer(sessionId: string, dto: SubmitAnswerDto): Promise<{
        id: string;
        questionOrder: number;
        correct: boolean;
        timeToAnswer: number | null;
        sessionId: string;
    }>;
    finishGame(sessionId: string, dto: FinishGameDto): Promise<{
        id: string;
        studentName: string;
        score: number;
        totalQuestions: number;
        percentage: number;
        timeUsed: number | null;
        finishedAt: Date | null;
    }>;
}
