"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GameService = class GameService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getActivityByCode(code) {
        const activity = await this.prisma.activity.findUnique({
            where: { code: code.toUpperCase() },
            include: {
                questions: {
                    orderBy: { order: 'asc' },
                    select: {
                        id: true,
                        order: true,
                        answer: true,
                        example: true,
                        question: true,
                        hint: true,
                    },
                },
                teacher: {
                    select: { name: true },
                },
            },
        });
        if (!activity) {
            throw new common_1.NotFoundException('Activity not found');
        }
        if (!activity.isActive) {
            throw new common_1.BadRequestException('This activity is not active');
        }
        return {
            id: activity.id,
            code: activity.code,
            title: activity.title,
            description: activity.description,
            timeLimit: activity.timeLimit,
            teacherName: activity.teacher.name,
            questions: activity.questions,
        };
    }
    async startGame(code, dto) {
        const activity = await this.prisma.activity.findUnique({
            where: { code: code.toUpperCase() },
            include: {
                questions: true,
            },
        });
        if (!activity) {
            throw new common_1.NotFoundException('Activity not found');
        }
        if (!activity.isActive) {
            throw new common_1.BadRequestException('This activity is not active');
        }
        const session = await this.prisma.gameSession.create({
            data: {
                studentName: dto.studentName,
                totalQuestions: activity.questions.length,
                activityId: activity.id,
            },
        });
        return {
            sessionId: session.id,
            startedAt: session.startedAt,
        };
    }
    async submitAnswer(sessionId, dto) {
        const session = await this.prisma.gameSession.findUnique({
            where: { id: sessionId },
        });
        if (!session) {
            throw new common_1.NotFoundException('Game session not found');
        }
        if (session.finishedAt) {
            throw new common_1.BadRequestException('Game session already finished');
        }
        const existingAnswer = await this.prisma.studentAnswer.findFirst({
            where: {
                sessionId,
                questionOrder: dto.questionOrder,
            },
        });
        if (existingAnswer) {
            throw new common_1.BadRequestException('Answer already submitted for this question');
        }
        const answer = await this.prisma.studentAnswer.create({
            data: {
                questionOrder: dto.questionOrder,
                correct: dto.correct,
                timeToAnswer: dto.timeToAnswer,
                sessionId,
            },
        });
        return answer;
    }
    async finishGame(sessionId, dto) {
        const session = await this.prisma.gameSession.findUnique({
            where: { id: sessionId },
            include: {
                answers: true,
            },
        });
        if (!session) {
            throw new common_1.NotFoundException('Game session not found');
        }
        if (session.finishedAt) {
            throw new common_1.BadRequestException('Game session already finished');
        }
        const correctAnswers = session.answers.filter((a) => a.correct).length;
        const updatedSession = await this.prisma.gameSession.update({
            where: { id: sessionId },
            data: {
                finishedAt: new Date(),
                timeUsed: dto.timeUsed,
                score: correctAnswers,
            },
        });
        return {
            id: updatedSession.id,
            studentName: updatedSession.studentName,
            score: correctAnswers,
            totalQuestions: updatedSession.totalQuestions,
            percentage: Math.round((correctAnswers / updatedSession.totalQuestions) * 100),
            timeUsed: updatedSession.timeUsed,
            finishedAt: updatedSession.finishedAt,
        };
    }
};
exports.GameService = GameService;
exports.GameService = GameService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GameService);
//# sourceMappingURL=game.service.js.map