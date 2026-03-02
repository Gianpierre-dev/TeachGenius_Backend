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
exports.ActivitiesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ActivitiesService = class ActivitiesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    generateCode() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        let code = '';
        for (let i = 0; i < 3; i++) {
            code += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        code += '-';
        for (let i = 0; i < 3; i++) {
            code += numbers.charAt(Math.floor(Math.random() * numbers.length));
        }
        return code;
    }
    async create(teacherId, dto) {
        let code;
        let isUnique = false;
        while (!isUnique) {
            code = this.generateCode();
            const existing = await this.prisma.activity.findUnique({
                where: { code },
            });
            if (!existing)
                isUnique = true;
        }
        return this.prisma.activity.create({
            data: {
                code: code,
                title: dto.title,
                description: dto.description,
                timeLimit: dto.timeLimit ?? 600,
                teacherId,
                questions: {
                    create: dto.questions.map((q) => ({
                        order: q.order,
                        answer: q.answer.toUpperCase(),
                        example: q.example,
                        question: q.question,
                        hint: q.hint,
                    })),
                },
            },
            include: {
                questions: {
                    orderBy: { order: 'asc' },
                },
            },
        });
    }
    async findAllByTeacher(teacherId) {
        return this.prisma.activity.findMany({
            where: { teacherId },
            include: {
                _count: {
                    select: {
                        questions: true,
                        gameSessions: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id, teacherId) {
        const activity = await this.prisma.activity.findUnique({
            where: { id },
            include: {
                questions: {
                    orderBy: { order: 'asc' },
                },
                teacher: {
                    select: { id: true, name: true },
                },
            },
        });
        if (!activity) {
            throw new common_1.NotFoundException('Activity not found');
        }
        if (teacherId && activity.teacherId !== teacherId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return activity;
    }
    async update(id, teacherId, dto) {
        await this.findById(id, teacherId);
        return this.prisma.activity.update({
            where: { id },
            data: dto,
            include: {
                questions: {
                    orderBy: { order: 'asc' },
                },
            },
        });
    }
    async delete(id, teacherId) {
        await this.findById(id, teacherId);
        await this.prisma.activity.delete({
            where: { id },
        });
        return { message: 'Activity deleted successfully' };
    }
    async getResults(id, teacherId) {
        await this.findById(id, teacherId);
        const sessions = await this.prisma.gameSession.findMany({
            where: { activityId: id },
            include: {
                answers: {
                    orderBy: { questionOrder: 'asc' },
                },
            },
            orderBy: { startedAt: 'desc' },
        });
        return sessions.map((session) => ({
            id: session.id,
            studentName: session.studentName,
            startedAt: session.startedAt,
            finishedAt: session.finishedAt,
            timeUsed: session.timeUsed,
            score: session.score,
            totalQuestions: session.totalQuestions,
            percentage: Math.round((session.score / session.totalQuestions) * 100),
            answers: session.answers,
        }));
    }
};
exports.ActivitiesService = ActivitiesService;
exports.ActivitiesService = ActivitiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ActivitiesService);
//# sourceMappingURL=activities.service.js.map