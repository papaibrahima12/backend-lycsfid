import { Repository } from 'typeorm';
import { Verification } from 'src/entities/Verification.entity';
import { Entreprise } from 'src/entities/Entreprise.entity';
export declare class VerificationService {
    private readonly verificationRepository;
    private readonly entrepriseRepository;
    constructor(verificationRepository: Repository<Verification>, entrepriseRepository: Repository<Entreprise>);
    verifyCompanyAccount(token: string): Promise<{
        message: string;
        entreprise: Entreprise;
    }>;
    reVerifyCompanyAccount(email: string): Promise<{
        message: string;
        entreprise: Entreprise;
    }>;
    private randomString;
}
