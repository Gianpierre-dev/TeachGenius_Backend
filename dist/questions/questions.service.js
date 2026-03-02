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
exports.QuestionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let QuestionsService = class QuestionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validateActivityOwnership(activityId, teacherId) {
        const activity = await this.prisma.activity.findUnique({
            where: { id: activityId },
        });
        if (!activity) {
            throw new common_1.NotFoundException('Activity not found');
        }
        if (activity.teacherId !== teacherId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return activity;
    }
    async create(activityId, teacherId, dto) {
        await this.validateActivityOwnership(activityId, teacherId);
        return this.prisma.question.create({
            data: {
                ...dto,
                answer: dto.answer.toUpperCase(),
                activityId,
            },
        });
    }
    async update(id, teacherId, dto) {
        const question = await this.prisma.question.findUnique({
            where: { id },
            include: { activity: true },
        });
        if (!question) {
            throw new common_1.NotFoundException('Question not found');
        }
        if (question.activity.teacherId !== teacherId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.question.update({
            where: { id },
            data: {
                ...dto,
                answer: dto.answer ? dto.answer.toUpperCase() : undefined,
            },
        });
    }
    async delete(id, teacherId) {
        const question = await this.prisma.question.findUnique({
            where: { id },
            include: { activity: true },
        });
        if (!question) {
            throw new common_1.NotFoundException('Question not found');
        }
        if (question.activity.teacherId !== teacherId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        await this.prisma.question.delete({
            where: { id },
        });
        return { message: 'Question deleted successfully' };
    }
};
exports.QuestionsService = QuestionsService;
exports.QuestionsService = QuestionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuestionsService);
//# sourceMappingURL=questions.service.js.map