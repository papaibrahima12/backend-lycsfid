/// <reference types="multer" />
/// <reference types="multer-gridfs-storage" />
import * as AWS from 'aws-sdk';
import { Bon } from 'src/entities/Bon.entity';
import { Entreprise } from 'src/entities/Entreprise.entity';
import { Repository } from 'typeorm';
export declare class BonService {
    private bonModel;
    private entrepriseModel;
    private readonly logger;
    constructor(bonModel: Repository<Bon>, entrepriseModel: Repository<Entreprise>);
    createBon(bonData: Bon, userId: number, file?: Express.Multer.File): Promise<{
        message: string;
        bon: Bon;
    }>;
    updateBon(id: number, bonData: Bon, file?: Express.Multer.File): Promise<{
        message: string;
        bon: Bon;
    }>;
    deleteBon(id: number): Promise<{
        message: string;
    }>;
    upload(file: any): Promise<string>;
    uploadS3(file: any, bucket: any, name: any): Promise<string>;
    getS3(): AWS.S3;
    getBons(): Promise<Bon[]>;
}
