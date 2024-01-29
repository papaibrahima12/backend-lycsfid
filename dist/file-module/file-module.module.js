"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileModuleModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const bon_controller_1 = require("../controllers/bon.controller");
const campagne_controller_1 = require("../controllers/campagne.controller");
const Bon_entity_1 = require("../entities/Bon.entity");
const Campagne_entity_1 = require("../entities/Campagne.entity");
const Entreprise_entity_1 = require("../entities/Entreprise.entity");
const bon_service_1 = require("../services/bon.service");
const campagne_service_1 = require("../services/campagne.service");
let FileModuleModule = class FileModuleModule {
};
exports.FileModuleModule = FileModuleModule;
exports.FileModuleModule = FileModuleModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([Campagne_entity_1.Campagne, Bon_entity_1.Bon, Entreprise_entity_1.Entreprise]),
        ],
        controllers: [bon_controller_1.BonController, campagne_controller_1.CampagneController],
        providers: [bon_service_1.BonService, campagne_service_1.CampagneService, jwt_1.JwtService],
    })
], FileModuleModule);
//# sourceMappingURL=file-module.module.js.map