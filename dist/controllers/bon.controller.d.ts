/// <reference types="multer" />
/// <reference types="multer-gridfs-storage" />
import { Bon } from 'src/entities/Bon.entity';
import { BonService } from 'src/services/bon.service';
export declare class BonController {
    private bonService;
    constructor(bonService: BonService);
    createBon(bonData: any, file: Express.Multer.File, request: {
        user: {
            userId: number;
        };
    }): Promise<any>;
    updateBon(id: number, bonData: any, file: Express.Multer.File): Promise<any>;
    deleteBon(id: number): Promise<any>;
    getUsers(): Promise<Bon[]>;
}
