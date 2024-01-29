/// <reference types="multer" />
/// <reference types="multer-gridfs-storage" />
import { Campagne } from 'src/entities/Campagne.entity';
import { CampagneService } from 'src/services/campagne.service';
export declare class CampagneController {
    private campagneService;
    constructor(campagneService: CampagneService);
    createCampagne(campagneData: any, file: Express.Multer.File, request: {
        user: {
            userId: number;
        };
    }): Promise<any>;
    updateCampagne(id: number, campagneData: any, file: Express.Multer.File): Promise<any>;
    deleteCampagne(id: number): Promise<any>;
    getCampagnes(request: {
        user: {
            userId: number;
        };
    }): Promise<Campagne[]>;
}
