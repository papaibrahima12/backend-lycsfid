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
exports.Entreprise = void 0;
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
let Entreprise = class Entreprise {
};
exports.Entreprise = Entreprise;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Entreprise.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true, unique: false, name: 'prenom' }),
    __metadata("design:type", String)
], Entreprise.prototype, "prenom", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true, unique: false, name: 'nom' }),
    __metadata("design:type", String)
], Entreprise.prototype, "nom", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, typeorm_1.Column)({ type: 'varchar', length: 40, nullable: false, unique: true }),
    __metadata("design:type", String)
], Entreprise.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsEmpty)(),
    (0, typeorm_1.Column)({ type: 'enum', enum: ['Dakar', 'Thies', 'Diourbel', 'Fatick', 'Kaffrine', 'Kaolack', 'Kedougou', 'Kolda', 'Louga', 'Matam', 'Saint-Louis', 'Sedhiou', 'Tambacounda', 'Ziguinchor'] }),
    __metadata("design:type", String)
], Entreprise.prototype, "adresse", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], Entreprise.prototype, "telephone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', default: 'entreprise' }),
    __metadata("design:type", String)
], Entreprise.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], Entreprise.prototype, "ninea", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Entreprise.prototype, "groupe", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Entreprise.prototype, "sousGroupe", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Entreprise.prototype, "contactRef", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], Entreprise.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], Entreprise.prototype, "new_password", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Entreprise.prototype, "verified", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Entreprise.prototype, "verificationCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', default: null }),
    __metadata("design:type", Date)
], Entreprise.prototype, "verifiedAt", void 0);
exports.Entreprise = Entreprise = __decorate([
    (0, typeorm_1.Entity)()
], Entreprise);
//# sourceMappingURL=Entreprise.entity.js.map