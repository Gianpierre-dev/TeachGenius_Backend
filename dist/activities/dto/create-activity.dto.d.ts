export declare class CreateQuestionDto {
    order: number;
    answer: string;
    example: string;
    question: string;
    hint?: string;
}
export declare class CreateActivityDto {
    title: string;
    description?: string;
    timeLimit?: number;
    questions: CreateQuestionDto[];
}
