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
exports.BonController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const company_guard_1 = require("../guards/company.guard");
const bon_service_1 = require("../services/bon.service");
let BonController = class BonController {
    constructor(bonService) {
        this.bonService = bonService;
    }
    async createBon(bonData, file, request) {
        const userId = request['user'].userId;
        return this.bonService.createBon(bonData, userId, file);
    }
    async updateBon(id, bonData, file) {
        return this.bonService.updateBon(id, bonData, file);
    }
    async deleteBon(id) {
        return this.bonService.deleteBon(id);
    }
    async getUsers() {
        return this.bonService.getBons();
    }
};
exports.BonController = BonController;
__decorate([
    (0, common_1.Post)('company/bon/add'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], BonController.prototype, "createBon", null);
__decorate([
    (0, common_1.Put)('company/bon/update/:id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], BonController.prototype, "updateBon", null);
__decorate([
    (0, common_1.Delete)('company/bon/delete/:id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BonController.prototype, "deleteBon", null);
__decorate([
    (0, common_1.Get)('company/bons/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BonController.prototype, "getUsers", null);
exports.BonController = BonController = __decorate([
    (0, common_1.Controller)('api/v1'),
    (0, common_1.UseGuards)(company_guard_1.CompanyGuard),
    __metadata("design:paramtypes", [bon_service_1.BonService])
], BonController);
//# sourceMappingURL=bon.controller.js.map