import { Entreprise } from "./Entreprise.entity";
export declare class Bon {
    id: number;
    nomBon: string;
    dateDebut: Date;
    dateFin: Date;
    typeBon: string;
    typeReduction: string;
    codeReduction: string;
    reduction: string;
    ageCible: string;
    sexeCible: string;
    localisation: string;
    image: string;
    isActive: boolean;
    status: string;
    entreprise: Entreprise;
}
