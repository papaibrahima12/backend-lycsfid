"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("../guards/auth/config");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_service_1 = require("../services/auth.service");
const verification_service_1 = require("../services/verification.service");
const send_email_service_1 = require("../services/send-email.service");
const typeorm_1 = require("@nestjs/typeorm");
const Verification_entity_1 = require("../entities/Verification.entity");
const Particulier_entity_1 = require("../entities/Particulier.entity");
const Entreprise_entity_1 = require("../entities/Entreprise.entity");
const User_entity_1 = require("../entities/User.entity");
let UserAuthModule = class UserAuthModule {
};
exports.UserAuthModule = UserAuthModule;
exports.UserAuthModule = UserAuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([User_entity_1.User, Entreprise_entity_1.Entreprise, Particulier_entity_1.Particulier, Verification_entity_1.Verification]),
            jwt_1.JwtModule.register({
                secret: config_1.secretKey.secret,
                signOptions: { expiresIn: '1h' },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, verification_service_1.VerificationService, send_email_service_1.SendEmailService],
    })
], UserAuthModule);
//# sourceMappingURL=user-auth.module.js.map