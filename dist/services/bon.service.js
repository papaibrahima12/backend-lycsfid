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
var BonService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BonService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const AWS = require("aws-sdk");
const Bon_entity_1 = require("../entities/Bon.entity");
const Entreprise_entity_1 = require("../entities/Entreprise.entity");
const typeorm_2 = require("typeorm");
let BonService = BonService_1 = class BonService {
    constructor(bonModel, entrepriseModel) {
        this.bonModel = bonModel;
        this.entrepriseModel = entrepriseModel;
        this.logger = new common_1.Logger(BonService_1.name);
    }
    async createBon(bonData, userId, file) {
        const bon = await this.bonModel.findOne({ where: { codeReduction: bonData.codeReduction } });
        if (bon) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: 'Ce bon existe deja',
            }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        if (bonData.dateDebut > bonData.dateFin) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: 'La date de debut doit etre inferieur à la date de fin',
            }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        if (file) {
            const uploadedImage = await this.upload(file);
            bonData.image = uploadedImage;
            const entreprise = await this.entrepriseModel.findOne({ where: { id: userId } });
            if (!entreprise) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.NOT_FOUND,
                    error: 'Entreprise non trouvée',
                }, common_1.HttpStatus.NOT_FOUND);
            }
            bonData.entreprise = entreprise;
            await this.bonModel.save(bonData);
            return { message: "Bon crée avec succès", bon: bonData };
        }
        else {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: 'Vous devez charger une image',
            }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }
    async updateBon(id, bonData, file) {
        const existingBon = await this.bonModel.findOne({ where: { id: id } });
        if (!existingBon) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.NOT_FOUND,
                error: 'Bon introuvable',
            }, common_1.HttpStatus.NOT_FOUND);
        }
        if (file) {
            const uploadedImage = await this.upload(file);
            bonData.image = uploadedImage;
        }
        Object.assign(existingBon, bonData);
        const majBon = await this.bonModel.save(existingBon);
        return { message: 'Bon modifié avec succès !', bon: majBon };
    }
    async deleteBon(id) {
        const existingBon = await this.bonModel.findOne({ where: { id: id } });
        if (!existingBon) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.NOT_FOUND,
                error: 'Bon introuvable',
            }, common_1.HttpStatus.NOT_FOUND);
        }
        await this.bonModel.remove(existingBon);
        return { message: 'Bon supprimé avec succès !' };
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
    async getBons() {
        try {
            const bons = await this.bonModel.find({});
            return bons;
        }
        catch (error) {
            this.logger.error(`An error occurred while retrieving bons: ${error.message}`);
            throw new Error('An error occurred while retrieving bons');
        }
    }
};
exports.BonService = BonService;
exports.BonService = BonService = BonService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Bon_entity_1.Bon)),
    __param(1, (0, typeorm_1.InjectRepository)(Entreprise_entity_1.Entreprise)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BonService);
//# sourceMappingURL=bon.service.js.map