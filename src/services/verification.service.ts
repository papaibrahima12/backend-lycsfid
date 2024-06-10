import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Verification } from 'src/entities/Verification.entity';
import { Entreprise } from 'src/entities/Entreprise.entity';
import { SendEmailService } from './send-email.service';

@Injectable()
export class VerificationService {
  constructor(
    @InjectRepository(Verification)
    private readonly verificationRepository: Repository<Verification>,
    @InjectRepository(Entreprise)
    private readonly entrepriseRepository: Repository<Entreprise>,
    private sendEmailService:SendEmailService
  ) {}

  async verifyCompanyAccount(id: number): Promise<{ message: string; entreprise: Entreprise }> {
    const existCompanyAccount = await this.entrepriseRepository.findOne({
      where:{ id : id}
    });
  
    if (!existCompanyAccount) {
      throw new NotFoundException('Entreprise introuvable !');
    }
  const verification = await this.verificationRepository.findOne({
    where: {user:existCompanyAccount, type: 'Creating New Account' },  relations: ['user']
  });

  if (!verification) {
    throw new NotFoundException('Compte déjà activé, veuillez vous connecter svp !');
  }

  await this.entrepriseRepository.update(existCompanyAccount.id, {
    verified: true,
    verifiedAt: new Date(),
  });
  await this.sendEmailService.notifyActivationAccount(existCompanyAccount.email);
  await this.verificationRepository.delete(verification.id);

  return { message: 'Compte activé avec succès !', entreprise: existCompanyAccount };
}


  async reVerifyCompanyAccount(email: string): Promise<{ message: string; entreprise: Entreprise }> {
  const company = await this.entrepriseRepository.findOne({ where: { email } });

  if (!company) {
    throw new NotFoundException('Partenaire introuvable');
  }

  const verification = await this.verificationRepository.findOne({
    where: { user: { id: company.id }, type: 'Creating New Account' },
  });


  if (verification) {
    await this.verificationRepository.delete(verification.id);
  }

  const newVerification = await this.verificationRepository.save({
    token: this.randomString(50),
    userId: company,
    type: 'Creating New Account',
  });

  await this.verificationRepository.save(newVerification);

  return { message: 'Nouvelle vérification envoyée avec succès', entreprise: company };
}


  private randomString(length: number): string {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
