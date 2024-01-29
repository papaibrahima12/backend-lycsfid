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
exports.Bon = void 0;
const typeorm_1 = require("typeorm");
const Entreprise_entity_1 = require("./Entreprise.entity");
let Bon = class Bon {
};
exports.Bon = Bon;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Bon.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Bon.prototype, "nomBon", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Bon.prototype, "dateDebut", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Bon.prototype, "dateFin", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 220, nullable: true }),
    __metadata("design:type", String)
], Bon.prototype, "typeBon", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['montant', 'taux'] }),
    __metadata("design:type", String)
], Bon.prototype, "typeReduction", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Bon.prototype, "codeReduction", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 25 }),
    __metadata("design:type", String)
], Bon.prototype, "reduction", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['10-20ans', '20-30ans', '30-50ans', '50-60ans', '60-plus'] }),
    __metadata("design:type", String)
], Bon.prototype, "ageCible", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['Masculin', 'Feminin'] }),
    __metadata("design:type", String)
], Bon.prototype, "sexeCible", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['Dakar', 'Thies', 'Diourbel', 'Fatick', 'Kaffrine', 'Kaolack', 'Kedougou', 'Kolda', 'Louga', 'Matam', 'Saint-Louis', 'Sedhiou', 'Tambacounda', 'Ziguinchor'] }),
    __metadata("design:type", String)
], Bon.prototype, "localisation", void 0);
__decorate([
    (0, typeorm_1.Column)({}),
    __metadata("design:type", String)
], Bon.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Bon.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['consommé', 'non-consommé', 'cloturé'], default: 'non-consommé' }),
    __metadata("design:type", String)
], Bon.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Entreprise_entity_1.Entreprise, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'entrepriseId' }),
    __metadata("design:type", Entreprise_entity_1.Entreprise)
], Bon.prototype, "entreprise", void 0);
exports.Bon = Bon = __decorate([
    (0, typeorm_1.Entity)()
], Bon);
//# sourceMappingURL=Bon.entity.js.map