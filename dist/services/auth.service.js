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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const User_entity_1 = require("../entities/User.entity");
const Entreprise_entity_1 = require("../entities/Entreprise.entity");
const Particulier_entity_1 = require("../entities/Particulier.entity");
const Verification_entity_1 = require("../entities/Verification.entity");
let AuthService = AuthService_1 = class AuthService {
    constructor(userRepository, entrepriseRepository, particulierRepository, verificationRepository, jwtService) {
        this.userRepository = userRepository;
        this.entrepriseRepository = entrepriseRepository;
        this.particulierRepository = particulierRepository;
        this.verificationRepository = verificationRepository;
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async registerAdmin(email, adresse, password, new_password) {
        const user = await this.userRepository.findOne({ where: { email: email } });
        if (user) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: 'Cet utilisateur existe déjà',
            }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        const hash = await bcrypt.hash(password, 10);
        await this.userRepository.save({ email, adresse, password: hash, new_password: hash });
        return { message: 'Inscription Reussie' };
    }
    async registerCompany(email, telephone, adresse, ninea, password, new_password) {
        const user = await this.entrepriseRepository.findOne({ where: { email: email } });
        if (user) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: 'Ce partenaire existe déjà',
            }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        if (password !== new_password) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: 'les mots de passe ne correspondent pas',
            }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        const hash = await bcrypt.hash(password, 10);
        const hashedPassword = await bcrypt.hash(password, hash);
        const newCompanyAccount = await this.entrepriseRepository.save({
            telephone: telephone,
            email: email,
            adresse: adresse,
            ninea: ninea,
            password: hashedPassword,
            new_password: hashedPassword,
        });
        const verification = await this.verificationRepository.save({
            token: this.randomString(50),
            user: newCompanyAccount,
            type: 'Creating New Account',
        });
        console.log(verification);
        return { message: "Inscription Partenaire Reussie,votre compte est en cours d'activation ! Vous recevrez un mail !" };
    }
    async registerParticulier(telephone, birthDate, adresse, password, new_password) {
        const user = await this.particulierRepository.findOne({ where: { telephone: telephone } });
        if (user) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: 'Ce numero existe déjà',
            }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        if (telephone == "" || telephone == null) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: 'le telephone est requis',
            }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        if (password !== new_password) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: 'les mots de passe ne correspondent pas',
            }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        const hash = await bcrypt.hash(password, 10);
        const hashedPassword = await bcrypt.hash(password, hash);
        await this.particulierRepository.save({
            telephone: telephone,
            adresse: adresse,
            birthDate: birthDate,
            password: hashedPassword,
            new_password: hashedPassword,
        });
        return { message: "Inscription Reussie,veuillez vous connecter !" };
    }
    async loginAdmin(email, password) {
        const user = await this.userRepository.findOne({ where: { email: email } });
        if (!user) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.NOT_FOUND,
                error: "Cet utilisateur n'existe pas",
            }, common_1.HttpStatus.NOT_FOUND);
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new common_1.UnauthorizedException('Mot de passe incorrect');
        }
        const payload = { userId: user.id, role: user.role };
        const token = this.jwtService.sign(payload);
        return token;
    }
    async loginCompany(email, password) {
        const user = await this.entrepriseRepository.findOne({ where: { email: email } });
        if (!user) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.NOT_FOUND,
                error: "Compte inexistant, veuillez vous inscrire svp !",
            }, common_1.HttpStatus.NOT_FOUND);
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new common_1.UnauthorizedException('Mot de passe incorrect');
        }
        if (user.verified == false) {
            throw new common_1.UnauthorizedException("Votre compte n'est pas encore activé !");
        }
        const payload = { userId: user.id, role: user.role };
        const token = this.jwtService.sign(payload);
        return { token, user };
    }
    async loginParticulier(telephone, password) {
        const user = await this.particulierRepository.findOne({ where: { telephone: telephone } });
        if (!user) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.NOT_FOUND,
                error: "Compte inexistant, veuillez vous inscrire svp !",
            }, common_1.HttpStatus.NOT_FOUND);
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new common_1.UnauthorizedException('Mot de passe incorrect');
        }
        const payload = { userId: user.id, role: user.role };
        const token = this.jwtService.sign(payload);
        return { token, user };
    }
    async changePasswordCompany(verificationCode, new_password, new_password_conf) {
        const company = await this.entrepriseRepository.findOne({ where: { verificationCode: verificationCode } });
        if (!company) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.NOT_FOUND,
                error: "Ce code n'existe pas",
            }, common_1.HttpStatus.NOT_FOUND);
        }
        if (new_password != new_password_conf) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: 'les mots de passe ne correspondent pas',
            }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        const hash = await bcrypt.hash(new_password, 10);
        const hashedPassword = await bcrypt.hash(new_password, hash);
        company.password = hashedPassword;
        company.new_password = hashedPassword;
        company.verificationCode = null;
        this.entrepriseRepository.save(company);
        return { message: "Mot de passe modifié avec succès!" };
    }
    async changePasswordParticulier() { }
    async getUsers() {
        try {
            const users = await this.userRepository.find({});
            return users;
        }
        catch (error) {
            this.logger.error(`An error occurred while retrieving users: ${error.message}`);
            throw new Error('An error occurred while retrieving users');
        }
    }
    async getVerifications() {
        try {
            const verifications = await this.verificationRepository.find({});
            return verifications;
        }
        catch (error) {
            this.logger.error(`An error occurred while retrieving verification: ${error.message}`);
            throw new Error('An error occurred while retrieving verification');
        }
    }
    randomString(length) {
        let result = "";
        let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(User_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(Entreprise_entity_1.Entreprise)),
    __param(2, (0, typeorm_1.InjectRepository)(Particulier_entity_1.Particulier)),
    __param(3, (0, typeorm_1.InjectRepository)(Verification_entity_1.Verification)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map