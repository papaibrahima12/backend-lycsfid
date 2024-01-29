import { Particulier } from 'src/entities/Particulier.entity';
import { User } from 'src/entities/User.entity';
import { Verification } from 'src/entities/Verification.entity';
import { Entreprise } from 'src/entities/Entreprise.entity';
import { AuthService } from 'src/services/auth.service';
import { SendEmailService } from 'src/services/send-email.service';
import { VerificationService } from 'src/services/verification.service';
export declare class AuthController {
    private readonly userAuthService;
    private readonly emailService;
    private readonly verificationService;
    constructor(userAuthService: AuthService, emailService: SendEmailService, verificationService: VerificationService);
    registerAdmin(body: {
        email: string;
        adresse: string;
        password: string;
        new_password: string;
    }): Promise<{
        message: string;
    }>;
    registerCompany(companyInfo: {
        email: string;
        telephone: string;
        adresse: string;
        ninea: string;
        password: string;
        new_password: string;
    }): Promise<{
        message: string;
    }>;
    registerClient(clientInfo: {
        telephone: string;
        birthDate: Date;
        adresse: string;
        password: string;
        new_password: string;
    }): Promise<{
        message: string;
    }>;
    loginAdmin(body: {
        email: string;
        password: string;
    }): Promise<{
        message: string;
        token: string;
    }>;
    loginCompany(body: {
        email: string;
        password: string;
    }): Promise<{
        message: string;
        token: string;
        user: Entreprise;
    }>;
    loginParticulier(body: {
        telephone: string;
        password: string;
    }): Promise<{
        message: string;
        token: string;
        user: Particulier;
    }>;
    verifyCompanyAccount(token: string): Promise<{
        message: string;
        entreprise: Entreprise;
    }>;
    reVerifyCompanyAccount(body: {
        email: string;
    }): Promise<{
        message: string;
        entreprise: Entreprise;
    }>;
    sendResetPasswordEmail(body: {
        email: string;
    }): Promise<{
        message: string;
    }>;
    changePassword(body: {
        verificationCode: string;
        new_password: string;
        new_password_conf: string;
    }): Promise<{
        message: string;
    }>;
    getUsers(): Promise<User[]>;
    getVerifications(): Promise<Verification[]>;
}
