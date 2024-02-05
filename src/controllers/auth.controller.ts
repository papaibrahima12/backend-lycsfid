import { Body, Controller, Post, Get, UseGuards, Param, Req, HttpStatus, Res } from '@nestjs/common';
import { Particulier } from 'src/entities/Particulier.entity';
import { User } from 'src/entities/User.entity';
import { Verification } from 'src/entities/Verification.entity';
import { Entreprise } from 'src/entities/Entreprise.entity';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { AuthService } from 'src/services/auth.service';
import { SendEmailService } from 'src/services/send-email.service';
import { VerificationService } from 'src/services/verification.service';
import { ApiTags, ApiOperation,ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/guards/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/guards/auth/local.auth.guard';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { CompanyGuard } from 'src/guards/company.guard';

@ApiTags('Authentification for all users')
@Controller('api/auth')
export class AuthController {
    constructor(private readonly userAuthService: AuthService,
                private readonly emailService:SendEmailService,
                private readonly verificationService: VerificationService) {}

  @Post('admin/register')
  @ApiOperation({ summary: 'Inscription Administrateur' })
  @ApiBody({
    schema:{
      type: 'object',
      properties: {
        email : {type:'string'},
        adresse : {type:'enum', enum:['Dakar','Thies','Diourbel','Fatick','Kaffrine','Kaolack','Kedougou','Kolda','Louga','Matam','Saint-Louis','Sedhiou','Tambacounda','Ziguinchor']},
        password : {type: 'string'},
        new_password : {type:'string'},
      },
    },
    description: 'Inscription Administrateur',
  })
  async registerAdmin(@Body() body: { email: string; adresse: string; password: string ;new_password:string}): Promise<{ message: string }> {
    const { email,adresse, password, new_password } = body;
    await this.userAuthService.registerAdmin(email,adresse,password,new_password);
    return { message: 'Insciption reussie' };
  }

  @Post('company/register')
  @ApiBody({
    schema:{
      type: 'object',
      properties: {
        email : {type:'string'},
        telephone : {type:'string'},
        adresse : {type:'enum', enum:['Dakar','Thies','Diourbel','Fatick','Kaffrine','Kaolack','Kedougou','Kolda','Louga','Matam','Saint-Louis','Sedhiou','Tambacounda','Ziguinchor']},
        ninea : {type:'string'},
        password : {type: 'string'},
        new_password : {type:'string'},
      },
    },
    description: 'Inscription Entreprise',
  })
  async registerCompany(@Body() companyInfo: Entreprise): Promise<{ message: string }> {
    await this.userAuthService.registerCompany(companyInfo.email, companyInfo.telephone,companyInfo.adresse, companyInfo.ninea, companyInfo.password,companyInfo.new_password);
    return { message: 'Inscription reussie, vous recevrez un email dès que le compte sera activé !' };
  }

  @Post('particulier/register')
  @ApiBody({
    schema:{
      type: 'object',
      properties: {
        telephone : {type:'string'},
        birthDate : {type:'string', format: "date"},
        adresse : {type:'enum', enum:['Dakar','Thies','Diourbel','Fatick','Kaffrine','Kaolack','Kedougou','Kolda','Louga','Matam','Saint-Louis','Sedhiou','Tambacounda','Ziguinchor']},
        password : {type: 'string'},
        new_password : {type:'string'},
      },
    },
    description: 'Inscription Client',
  })
  async registerClient(@Body() clientInfo: Particulier): Promise<{ message: string }> {
    await this.userAuthService.registerParticulier(clientInfo.telephone,clientInfo.birthDate, clientInfo.adresse, clientInfo.password,clientInfo.new_password);
    return { message: 'Inscription reussie, Veuillez vous connecter !' };
  }

  @Post('admin/login')
  @ApiBody({
    schema:{
      type: 'object',
      properties: {
        email : {type:'string'},
        password : {type: 'string'},
      },
    },
    description: 'Connexion Admin',
  })
  async loginAdmin(@Body() body: { email: string; password: string },@Res({ passthrough: true }) res: Response): Promise<any> {
    const { email, password } = body;
    const result = await this.userAuthService.loginAdmin(email, password);
    // res.cookie('token', result.token, {
    //     httpOnly: true,
    //     secure: false,
    //     sameSite: 'lax',
    //     expires: new Date(Date.now() + 1 * 100 * 100 * 1000),
    //   })
    //   .send({ message: 'Connexion Réussie', user:result.user  });
      return { message: 'Connexion Réussie',token:result.token, user:result.user  };
  }

  @Post('company/login')
  @ApiBody({
    schema:{
      type: 'object',
      properties: {
        email : {type:'string'},
        password : {type: 'string'},
      },
    },
    description: 'Connexion Entreprise',
  })
  async loginCompany(@Body() body: { email: string; password: string },@Res({ passthrough: true }) res: Response): Promise<any> {
    const { email, password } = body;
    const result = await this.userAuthService.loginCompany(email, password);
    // res.cookie('token', result.token, {
    //     httpOnly: true,
    //     secure: false,
    //     sameSite: 'lax',
    //     expires: new Date(Date.now() + 1 * 100 * 100 * 1000),
    //   })
    //   .send({ message: 'Connexion Réussie', user:result.user  });
    return { message: 'Connexion Réussie',token:result.token, user:result.user  };
  }

  @Post('particulier/login')
  @ApiBody({
    schema:{
      type: 'object',
      properties: {
        telephone : {type:'string'},
        password : {type: 'string'},
      },
    },
    description: 'Connexion Client',
  })
  @ApiBearerAuth() 
  async loginParticulier(@Body() body: { telephone: string; password: string }): Promise<{ message: string; token: string; user: Particulier }> {
    const { telephone, password } = body;
    const result = await this.userAuthService.loginParticulier(telephone, password);
    return { message: 'Connexion Réussie', token:result.token, user:result.user };
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth() 
  @Get('admin/verifyCompany/:token')
  async verifyCompanyAccount(@Param('token') token: string) {
    const result = await this.verificationService.verifyCompanyAccount(token);
    return result;
  }

  @Post('admin/reVerifyCompany/')
  @ApiBody({
    schema:{
      type: 'object',
      properties: {
        email : {type:'string'},
      },
    },
    description: 'Reverification Entreprise',
  })
  @UseGuards(AuthGuard)
  @ApiBearerAuth() 
  async reVerifyCompanyAccount(@Body() body :{email: string}) {
    const { email } = body;
    const result = await this.verificationService.reVerifyCompanyAccount(email);
    return result;
  }

  @Post('company/resetPassword')
  @ApiBody({
    schema:{
      type: 'object',
      properties: {
        email : {type:'string'},
      },
    },
    description: 'Reinitialisation Mot de passe',
  })
  async sendResetPasswordEmail(@Body() body: { email: string }): Promise<{ message: string }> {
    const { email } = body;
    await this.emailService.sendResetPasswordEmail(email);
    return { message: 'Un email vous a été envoyé avec succès !' };
  }

  @Post('company/password/reset')
  @ApiBody({
    schema:{
      type: 'object',
      properties: {
        verificationCode : {type:'string'},
        new_password : {type: 'string'},
        new_password_conf : {type: 'string'},
      },
    },
    description:'Changement du mot de passe',
  })
  async changePassword(@Body() body: { verificationCode: string, new_password:string,new_password_conf:string }): Promise<{ message: string }> {
    const { verificationCode, new_password,new_password_conf } = body;
    await this.userAuthService.changePasswordCompany(verificationCode,new_password,new_password_conf);
    return { message: 'Mot de passe changé avec succès !' };
  }
  
  @Get('users')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getUsers(): Promise<User[]> {
    return this.userAuthService.getUsers();
  }

  @Get('particuliers')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getParticuliers(): Promise<Particulier[]> {
    return this.userAuthService.getClients();
  }

  @Get('companies')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getEntreprises(): Promise<Entreprise[]> {
    return this.userAuthService.getEntreprises();
  }


  @Get('admin/verifications')
  @UseGuards(AuthGuard)
  @ApiBearerAuth() 
  async getVerifications(): Promise<Verification[]> {
    return this.userAuthService.getVerifications();
  }

  // @Get('admin/logout')
  // async logout(@Req() req : Request,@Res() res:Response): Promise<any> {
  //   req.session.destroy(() => {
  //    return res.status(200).clearCookie('token', {path:'/'}).json({message:'Logout Successfull'});
  //   });
  // }

  // @Get('company/logout')
  // @UseGuards(CompanyGuard)
  // @ApiBearerAuth() 
  // async logoutCompany(@Req() req : Request,@Res() res:Response): Promise<any> {
  //   req.session.destroy(() => {
  //    return res.status(200).clearCookie('token', {path:'/'}).json({message:'Logout Successfull'});
  //   });
  // }
}
