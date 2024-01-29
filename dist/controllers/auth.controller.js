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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../guards/auth/auth.guard");
const auth_service_1 = require("../services/auth.service");
const send_email_service_1 = require("../services/send-email.service");
const verification_service_1 = require("../services/verification.service");
let AuthController = class AuthController {
    constructor(userAuthService, emailService, verificationService) {
        this.userAuthService = userAuthService;
        this.emailService = emailService;
        this.verificationService = verificationService;
    }
    async registerAdmin(body) {
        const { email, adresse, password, new_password } = body;
        await this.userAuthService.registerAdmin(email, adresse, password, new_password);
        return { message: 'Admin registered successfully' };
    }
    async registerCompany(companyInfo) {
        await this.userAuthService.registerCompany(companyInfo.email, companyInfo.telephone, companyInfo.adresse, companyInfo.ninea, companyInfo.password, companyInfo.new_password);
        return { message: 'Inscription reussie, vous recevrez un email dès que le compte sera activé !' };
    }
    async registerClient(clientInfo) {
        await this.userAuthService.registerParticulier(clientInfo.telephone, clientInfo.birthDate, clientInfo.adresse, clientInfo.password, clientInfo.new_password);
        return { message: 'Inscription reussie, Veuillez vous connecter !' };
    }
    async loginAdmin(body) {
        const { email, password } = body;
        const token = await this.userAuthService.loginAdmin(email, password);
        return { message: 'Connexion Reussie', token };
    }
    async loginCompany(body) {
        const { email, password } = body;
        const result = await this.userAuthService.loginCompany(email, password);
        return { message: 'Connexion Reussie', token: result.token, user: result.user };
    }
    async loginParticulier(body) {
        const { telephone, password } = body;
        const result = await this.userAuthService.loginParticulier(telephone, password);
        return { message: 'Connexion Réussie', token: result.token, user: result.user };
    }
    async verifyCompanyAccount(token) {
        const result = await this.verificationService.verifyCompanyAccount(token);
        return result;
    }
    async reVerifyCompanyAccount(body) {
        const { email } = body;
        const result = await this.verificationService.reVerifyCompanyAccount(email);
        return result;
    }
    async sendResetPasswordEmail(body) {
        const { email } = body;
        await this.emailService.sendResetPasswordEmail(email);
        return { message: 'Un email vous a été envoyé avec succès !' };
    }
    async changePassword(body) {
        const { verificationCode, new_password, new_password_conf } = body;
        await this.userAuthService.changePasswordCompany(verificationCode, new_password, new_password_conf);
        return { message: 'Mot de passe changé avec succès !' };
    }
    async getUsers() {
        return this.userAuthService.getUsers();
    }
    async getVerifications() {
        return this.userAuthService.getVerifications();
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('admin/register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerAdmin", null);
__decorate([
    (0, common_1.Post)('company/register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerCompany", null);
__decorate([
    (0, common_1.Post)('particulier/register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerClient", null);
__decorate([
    (0, common_1.Post)('admin/login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginAdmin", null);
__decorate([
    (0, common_1.Post)('company/login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginCompany", null);
__decorate([
    (0, common_1.Post)('particulier/login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginParticulier", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('admin/verifyCompany/:token'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyCompanyAccount", null);
__decorate([
    (0, common_1.Post)('admin/reVerifyCompany/'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "reVerifyCompanyAccount", null);
__decorate([
    (0, common_1.Post)('company/resetPassword'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendResetPasswordEmail", null);
__decorate([
    (0, common_1.Post)('company/password/reset'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)('admin/verifications'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getVerifications", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('api/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        send_email_service_1.SendEmailService,
        verification_service_1.VerificationService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map