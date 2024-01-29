/// <reference types="multer" />
/// <reference types="multer-gridfs-storage" />
import * as AWS from 'aws-sdk';
import { Repository } from 'typeorm';
import { Campagne } from 'src/entities/Campagne.entity';
import { Entreprise } from 'src/entities/Entreprise.entity';
export declare class CampagneService {
    private campagneModel;
    private entrepriseModel;
    private readonly logger;
    constructor(campagneModel: Repository<Campagne>, entrepriseModel: Repository<Entreprise>);
    createCampagne(campagneData: Campagne, userId: number, file?: Express.Multer.File): Promise<{
        message: string;
        campagne: Campagne;
    }>;
    updateCampagne(id: number, campagneData: Campagne, file?: Express.Multer.File): Promise<{
        message: string;
        campagne: Campagne;
    }>;
    deleteCampagne(id: number): Promise<{
        message: string;
    }>;
    upload(file: any): Promise<string>;
    uploadS3(file: any, bucket: any, name: any): Promise<string>;
    getS3(): AWS.S3;
    getCampagnes(userId: number): Promise<Campagne[]>;
}
