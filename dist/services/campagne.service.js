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
var CampagneService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampagneService = void 0;
const common_1 = require("@nestjs/common");
const AWS = require("aws-sdk");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Campagne_entity_1 = require("../entities/Campagne.entity");
const Entreprise_entity_1 = require("../entities/Entreprise.entity");
let CampagneService = CampagneService_1 = class CampagneService {
    constructor(campagneModel, entrepriseModel) {
        this.campagneModel = campagneModel;
        this.entrepriseModel = entrepriseModel;
        this.logger = new common_1.Logger(CampagneService_1.name);
    }
    async createCampagne(campagneData, userId, file) {
        const bon = await this.campagneModel.findOne({ where: { codePromo: campagneData.codePromo, entreprise: { id: userId } } });
        if (bon) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: 'Cette campagne existe déjà',
            }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        if (campagneData.dateDebut > campagneData.dateFin) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: 'La date de début doit etre inférieure à la date de fin',
            }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        if (file) {
            const uploadedImage = await this.upload(file);
            campagneData.image = uploadedImage;
            const entreprise = await this.entrepriseModel.findOne({ where: { id: userId } });
            if (!entreprise) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.NOT_FOUND,
                    error: 'Entreprise non trouvée',
                }, common_1.HttpStatus.NOT_FOUND);
            }
            campagneData.entreprise = entreprise;
            await this.campagneModel.save(campagneData);
            return { message: "Campagne crée avec succès", campagne: campagneData };
        }
        else {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: 'Vous devez charger une image',
            }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }
    async updateCampagne(id, campagneData, file) {
        const existingCampagne = await this.campagneModel.findOne({ where: { id: id } });
        if (!existingCampagne) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.NOT_FOUND,
                error: 'Campagne introuvable',
            }, common_1.HttpStatus.NOT_FOUND);
        }
        if (file) {
            const uploadedImage = await this.upload(file);
            campagneData.image = uploadedImage;
        }
        Object.assign(existingCampagne, campagneData);
        const majCampagne = await this.campagneModel.save(existingCampagne);
        return { message: 'Campagne modifié avec succès !', campagne: majCampagne };
    }
    async deleteCampagne(id) {
        const existingCampagne = await this.campagneModel.findOne({ where: { id: id } });
        if (!existingCampagne) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.NOT_FOUND,
                error: 'Campagne introuvable',
            }, common_1.HttpStatus.NOT_FOUND);
        }
        await this.campagneModel.remove(existingCampagne);
        return { message: 'Campagne supprimée avec succès !' };
    }
    async upload(file) {
        const { originalname } = file;
        const bucketS3 = 'lycsalliofiles';
        return this.uploadS3(file.buffer, bucketS3, originalname);
    }
    async uploadS3(file, bucket, name) {
        const s3 = this.getS3();
        const params = {
            Bucket: bucket,
            Key: String(name),
            acl: 'private',
            Body: file,
        };
        console.log(params);
        return new Promise((resolve, reject) => {
            s3.upload(params, (err, data) => {
                if (err) {
                    common_1.Logger.error(err);
                    reject(err.message);
                }
                resolve(data.Location);
            });
        });
    }
    getS3() {
        return new AWS.S3({
            accessKeyId: process.env.accessKEY,
            secretAccessKey: process.env.secretAccessKey,
        });
    }
    async getCampagnes(userId) {
        try {
            const entreprise = await this.entrepriseModel.findOne({ where: { id: userId } });
            if (!entreprise) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.NOT_FOUND,
                    error: 'Entreprise non trouvée',
                }, common_1.HttpStatus.NOT_FOUND);
            }
            const campagnes = await this.campagneModel.find({ where: { entreprise: entreprise } });
            return campagnes;
        }
        catch (error) {
            this.logger.error(`An error occurred while retrieving campagnes: ${error.message}`);
            throw new Error('An error occurred while retrieving campagnes');
        }
    }
};
exports.CampagneService = CampagneService;
exports.CampagneService = CampagneService = CampagneService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Campagne_entity_1.Campagne)),
    __param(1, (0, typeorm_1.InjectRepository)(Entreprise_entity_1.Entreprise)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CampagneService);
//# sourceMappingURL=campagne.service.js.map