"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailModule = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("../guards/auth/config");
const send_email_service_1 = require("../services/send-email.service");
const typeorm_1 = require("@nestjs/typeorm");
const Entreprise_entity_1 = require("../entities/Entreprise.entity");
let MailModule = class MailModule {
};
exports.MailModule = MailModule;
exports.MailModule = MailModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mailer_1.MailerModule.forRoot({
                transport: {
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: 'ibousow311@gmail.com',
                        pass: 'mype xtcn zuen isie',
                    },
                },
                defaults: {
                    from: '"No Reply" <noreply@example.com>',
                },
            }),
            typeorm_1.TypeOrmModule.forFeature([Entreprise_entity_1.Entreprise]),
            jwt_1.JwtModule.register({
                secret: config_1.secretKey.secret,
                signOptions: { expiresIn: '1h' },
            }),
        ],
        providers: [send_email_service_1.SendEmailService],
        exports: [send_email_service_1.SendEmailService],
    })
], MailModule);
//# sourceMappingURL=mailer.module.js.map