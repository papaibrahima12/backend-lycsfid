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
exports.VerificationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Verification_entity_1 = require("../entities/Verification.entity");
const Entreprise_entity_1 = require("../entities/Entreprise.entity");
let VerificationService = class VerificationService {
    constructor(verificationRepository, entrepriseRepository) {
        this.verificationRepository = verificationRepository;
        this.entrepriseRepository = entrepriseRepository;
    }
    async verifyCompanyAccount(token) {
        const verification = await this.verificationRepository.findOne({
            where: { token: token, type: 'Creating New Account' }, relations: ['user']
        });
        if (!verification) {
            throw new common_1.NotFoundException('Compte non vérifié');
        }
        const existCompanyAccount = await this.entrepriseRepository.findOne({
            where: { id: verification.user.id }
        });
        if (!existCompanyAccount) {
            throw new common_1.NotFoundException('Entreprise introuvable');
        }
        await this.entrepriseRepository.update(existCompanyAccount.id, {
            verified: true,
            verifiedAt: new Date(),
        });
        await this.verificationRepository.delete(verification.id);
        return { message: 'Compte activé avec succès', entreprise: existCompanyAccount };
    }
    async reVerifyCompanyAccount(email) {
        const company = await this.entrepriseRepository.findOne({ where: { email } });
        if (!company) {
            throw new common_1.NotFoundException('Partenaire introuvable');
        }
        const verification = await this.verificationRepository.findOne({
            where: { user: { id: company.id }, type: 'Creating New Account' },
        });
        if (verification) {
            await this.verificationRepository.delete(verification.id);
        }
        const newVerification = await this.verificationRepository.save({
            token: this.randomString(50),
            userId: company.id,
            type: 'Creating New Account',
        });
        await this.verificationRepository.save(newVerification);
        return { message: 'Nouvelle vérification envoyée avec succès', entreprise: company };
    }
    randomString(length) {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
};
exports.VerificationService = VerificationService;
exports.VerificationService = VerificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Verification_entity_1.Verification)),
    __param(1, (0, typeorm_1.InjectRepository)(Entreprise_entity_1.Entreprise)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], VerificationService);
//# sourceMappingURL=verification.service.js.map