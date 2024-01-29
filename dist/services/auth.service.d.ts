import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from 'src/entities/User.entity';
import { Entreprise } from 'src/entities/Entreprise.entity';
import { Particulier } from 'src/entities/Particulier.entity';
import { Verification } from 'src/entities/Verification.entity';
export declare class AuthService {
    private userRepository;
    private entrepriseRepository;
    private particulierRepository;
    private readonly verificationRepository;
    private jwtService;
    private readonly logger;
    constructor(userRepository: Repository<User>, entrepriseRepository: Repository<Entreprise>, particulierRepository: Repository<Particulier>, verificationRepository: Repository<Verification>, jwtService: JwtService);
    registerAdmin(email: string, adresse: string, password: string, new_password: string): Promise<{
        message: string;
    }>;
    registerCompany(email: string, telephone: string, adresse: string, ninea: string, password: string, new_password: string): Promise<{
        message: string;
    }>;
    registerParticulier(telephone: string, birthDate: Date, adresse: string, password: string, new_password: string): Promise<{
        message: string;
    }>;
    loginAdmin(email: string, password: string): Promise<string>;
    loginCompany(email: string, password: string): Promise<{
        token: string;
        user: Entreprise;
    }>;
    loginParticulier(telephone: string, password: string): Promise<{
        token: string;
        user: Particulier;
    }>;
    changePasswordCompany(verificationCode: string, new_password: string, new_password_conf: string): Promise<{
        message: string;
    }>;
    changePasswordParticulier(): Promise<void>;
    getUsers(): Promise<User[]>;
    getVerifications(): Promise<Verification[]>;
    private randomString;
}
