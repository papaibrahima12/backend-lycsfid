import { Entreprise } from "./Entreprise.entity";
export declare class Campagne {
    id: number;
    nomCampagne: string;
    codePromo: string;
    dateDebut: Date;
    dateFin: Date;
    ageCible: string;
    sexeCible: string;
    localisation: string;
    image: string;
    isActive: boolean;
    status: string;
    entreprise: Entreprise;
}
