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
exports.SendEmailService = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const Entreprise_entity_1 = require("../entities/Entreprise.entity");
const typeorm_2 = require("typeorm");
let SendEmailService = class SendEmailService {
    constructor(entrepriseModel, jwtService, mailerService) {
        this.entrepriseModel = entrepriseModel;
        this.jwtService = jwtService;
        this.mailerService = mailerService;
    }
    async sendResetPasswordEmail(email) {
        const user = await this.entrepriseModel.findOne({ where: { email } });
        if (!user) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.NOT_FOUND,
                error: "Utilisateur inexistant",
            }, common_1.HttpStatus.NOT_FOUND);
        }
        const verificationCode = crypto.randomBytes(7).toString('hex').toUpperCase();
        user.verificationCode = verificationCode;
        await this.entrepriseModel.save(user);
        const tokenPassword = this.jwtService.sign({ email, verificationCode });
        const resetPasswordLink = `http://localhost:4200/reset-password?token=${tokenPassword}`;
        await this.mailerService.sendMail({
            to: email,
            from: '"Lycs Allio" <ibousow311@gmail.com>',
            subject: 'Reset Your Password',
            html: `
      <p>Bonjour cher utilisateur,</p>
        <p>Vous avez demande une reinitialisation du mot de passe, veuillez sur le lien ci-dessous:</p>
        <a href="${resetPasswordLink}">${resetPasswordLink}</a>
        <p>Renseignez le code suivant : <em>${verificationCode}</em></p>
      `
        });
    }
};
exports.SendEmailService = SendEmailService;
exports.SendEmailService = SendEmailService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Entreprise_entity_1.Entreprise)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        mailer_1.MailerService])
], SendEmailService);
//# sourceMappingURL=send-email.service.js.map