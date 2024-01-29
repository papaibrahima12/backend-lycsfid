import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Entreprise } from 'src/entities/Entreprise.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SendEmailService {

  constructor(@InjectRepository(Entreprise) private entrepriseModel: Repository<Entreprise>,
               private jwtService: JwtService,
               private mailerService: MailerService) {}

  async sendResetPasswordEmail(email: string): Promise<void> {
    const user = await this.entrepriseModel.findOne({ where:{email} });
      if (!user) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: "Utilisateur inexistant",
        }, HttpStatus.NOT_FOUND)
      }
    const verificationCode = crypto.randomBytes(7).toString('hex').toUpperCase();
    user.verificationCode = verificationCode;
    await this.entrepriseModel.save(user);
    const tokenPassword = this.jwtService.sign({email,verificationCode});
    const resetPasswordLink = `http://localhost:4200/reset-password?token=${tokenPassword}`;

    await this.mailerService.sendMail({
      to: email,
      from: '"Lycs Allio" <ibousow311@gmail.com>',
      subject: 'Reset Your Password',
      html: `
      <p>Bonjour cher utilisateur,</p>
        <p>Vous avez demande une reinitialisation du mot de passe, veuillez sur le lien ci-dessous:</p>
        <a href="${resetPasswordLink}">${resetPasswordLink}</a>
        <p>Renseignez le code suivant : <em>${verificationCode}</em></p>
      `
    });
  } 
}
