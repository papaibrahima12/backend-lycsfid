import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Entreprise } from 'src/entities/Entreprise.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SendEmailService {

  constructor(@InjectRepository(Entreprise) private entrepriseModel: Repository<Entreprise>,
               private jwtService: JwtService,
               private configService: ConfigService,
               private mailerService: MailerService) {}

  async sendResetPasswordEmail(email: string): Promise<void> {
    const secret = this.configService.get<string>('key.access');
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
    const tokenPassword = this.jwtService.signAsync({email,verificationCode}, {secret});
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
  async sendWelcomeEmail(email: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      from: '"Lycs Allio" <ibousow311@gmail.com>',
      subject: 'Nouveau Compte',
      html: `
      <p>Bonjour cher partenaire,</p>
        <p>Votre inscription a été prise en compte, et votre compte est en cours d'activation. </p>
      `
    });
  } 

  async notifyActivationAccount(email: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      from: '"Lycs Allio" <ibousow311@gmail.com>',
      subject: 'Activation',
      html: `
      <p>Bonjour cher partenaire,</p>
        <p> Bienvenue chez LycsFID ! </p>
        <p>Votre compte a été activé avec succès, Vous pouvez vous connecter !</p>
      `
    });
  } 
}
