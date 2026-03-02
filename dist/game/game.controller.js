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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameController = void 0;
const common_1 = require("@nestjs/common");
const game_service_1 = require("./game.service");
const start_game_dto_1 = require("./dto/start-game.dto");
const submit_answer_dto_1 = require("./dto/submit-answer.dto");
const finish_game_dto_1 = require("./dto/finish-game.dto");
let GameController = class GameController {
    gameService;
    constructor(gameService) {
        this.gameService = gameService;
    }
    getActivity(code) {
        return this.gameService.getActivityByCode(code);
    }
    startGame(code, dto) {
        return this.gameService.startGame(code, dto);
    }
    submitAnswer(sessionId, dto) {
        return this.gameService.submitAnswer(sessionId, dto);
    }
    finishGame(sessionId, dto) {
        return this.gameService.finishGame(sessionId, dto);
    }
};
exports.GameController = GameController;
__decorate([
    (0, common_1.Get)(':code'),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GameController.prototype, "getActivity", null);
__decorate([
    (0, common_1.Post)(':code/start'),
    __param(0, (0, common_1.Param)('code')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, start_game_dto_1.StartGameDto]),
    __metadata("design:returntype", void 0)
], GameController.prototype, "startGame", null);
__decorate([
    (0, common_1.Post)('sessions/:sessionId/answer'),
    __param(0, (0, common_1.Param)('sessionId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, submit_answer_dto_1.SubmitAnswerDto]),
    __metadata("design:returntype", void 0)
], GameController.prototype, "submitAnswer", null);
__decorate([
    (0, common_1.Post)('sessions/:sessionId/finish'),
    __param(0, (0, common_1.Param)('sessionId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, finish_game_dto_1.FinishGameDto]),
    __metadata("design:returntype", void 0)
], GameController.prototype, "finishGame", null);
exports.GameController = GameController = __decorate([
    (0, common_1.Controller)('game'),
    __metadata("design:paramtypes", [game_service_1.GameService])
], GameController);
//# sourceMappingURL=game.controller.js.map