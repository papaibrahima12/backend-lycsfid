import { Body, Controller, Post, Get, UseGuards, Param } from '@nestjs/common';
import { Particulier } from 'src/entities/Particulier.entity';
import { User } from 'src/entities/User.entity';
import { Verification } from 'src/entities/Verification.entity';
import { Entreprise } from 'src/entities/Entreprise.entity';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { AuthService } from 'src/services/auth.service';
import { SendEmailService } from 'src/services/send-email.service';
import { VerificationService } from 'src/services/verification.service';

@Controller('api/auth')
export class AuthController {
    constructor(private readonly userAuthService: AuthService,
                private readonly emailService:SendEmailService,
                private readonly verificationService: VerificationService) {}

  @Post('admin/register')
  async registerAdmin(@Body() body: { email: string; adresse: string; password: string ;new_password:string}): Promise<{ message: string }> {
    const { email,adresse, password, new_password } = body;
    await this.userAuthService.registerAdmin(email,adresse,password,new_password);
    return { message: 'Admin registered successfully' };
  }

  @Post('company/register')
  async registerCompany(@Body() companyInfo: {
    email: string;
    telephone: string;
    adresse:string;
    ninea: string;
    password: string;
    new_password:string;
  }): Promise<{ message: string }> {
    await this.userAuthService.registerCompany(companyInfo.email, companyInfo.telephone,companyInfo.adresse, companyInfo.ninea, companyInfo.password,companyInfo.new_password);
    return { message: 'Inscription reussie, vous recevrez un email dès que le compte sera activé !' };
  }

  @Post('particulier/register')
  async registerClient(@Body() clientInfo: {
    telephone: string;
    birthDate:Date;
    adresse: string;
    password: string;
    new_password:string;
  }): Promise<{ message: string }> {
    await this.userAuthService.registerParticulier(clientInfo.telephone,clientInfo.birthDate, clientInfo.adresse, clientInfo.password,clientInfo.new_password);
    return { message: 'Inscription reussie, Veuillez vous connecter !' };
  }

  @Post('admin/login')
  async loginAdmin(@Body() body: { email: string; password: string }): Promise<{ message: string; token: string }> {
    const { email, password } = body;
    const token = await this.userAuthService.loginAdmin(email, password);
    return { message: 'Connexion Reussie', token };
  }

  @Post('company/login')
  async loginCompany(@Body() body: { email: string; password: string }): Promise<{ message: string; token: string; user: Entreprise }> {
    const { email, password } = body;
    const result = await this.userAuthService.loginCompany(email, password);
    return { message: 'Connexion Reussie', token:result.token, user:result.user };
  }

  @Post('particulier/login')
  async loginParticulier(@Body() body: { telephone: string; password: string }): Promise<{ message: string; token: string; user: Particulier }> {
    const { telephone, password } = body;
    const result = await this.userAuthService.loginParticulier(telephone, password);
    return { message: 'Connexion Réussie', token:result.token, user:result.user };
  }

  @UseGuards(AuthGuard)
  @Get('admin/verifyCompany/:token')
  async verifyCompanyAccount(@Param('token') token: string) {
    const result = await this.verificationService.verifyCompanyAccount(token);
    return result;
  }

  @Post('admin/reVerifyCompany/')
  async reVerifyCompanyAccount(@Body() body :{email: string}) {
    const { email } = body;
    const result = await this.verificationService.reVerifyCompanyAccount(email);
    return result;
  }

  @Post('company/resetPassword')
  async sendResetPasswordEmail(@Body() body: { email: string }): Promise<{ message: string }> {
    const { email } = body;
    await this.emailService.sendResetPasswordEmail(email);
    return { message: 'Un email vous a été envoyé avec succès !' };
  }

  @Post('company/password/reset')
  async changePassword(@Body() body: { verificationCode: string, new_password:string,new_password_conf:string }): Promise<{ message: string }> {
    const { verificationCode, new_password,new_password_conf } = body;
    await this.userAuthService.changePasswordCompany(verificationCode,new_password,new_password_conf);
    return { message: 'Mot de passe changé avec succès !' };
  }
  
  @Get('users')
  @UseGuards(AuthGuard)
  async getUsers(): Promise<User[]> {
    return this.userAuthService.getUsers();
  }



  @Get('admin/verifications')
  @UseGuards(AuthGuard)
  async getVerifications(): Promise<Verification[]> {
    return this.userAuthService.getVerifications();
  }
}
