import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { Entreprise } from 'src/entities/Entreprise.entity';
import { Repository } from 'typeorm';
export declare class SendEmailService {
    private entrepriseModel;
    private jwtService;
    private mailerService;
    constructor(entrepriseModel: Repository<Entreprise>, jwtService: JwtService, mailerService: MailerService);
    sendResetPasswordEmail(email: string): Promise<void>;
}
