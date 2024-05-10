import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Param,
  Request,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { Particulier } from "src/entities/Particulier.entity";
import { User } from "src/entities/User.entity";
import { Verification } from "src/entities/Verification.entity";
import { Entreprise } from "src/entities/Entreprise.entity";
import { AuthGuard } from "src/guards/auth/auth.guard";
import { AuthService } from "src/services/auth.service";
import { SendEmailService } from "src/services/send-email.service";
import { VerificationService } from "src/services/verification.service";
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiConsumes,
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { CompanyGuard } from "src/guards/company.guard";
import { Caissier } from "src/entities/Caissier.entity";
import { SendMessageServiceService } from "src/services/sendmessageservice.service";
import { OtpService } from "src/services/otp.service";
import { RefreshTokenGuard } from "src/guards/refreshtoken.guard";
import { RefreshtokenprticulierGuard } from "src/guards/refreshtokenprticulier.guard";

@ApiTags("Authentication for all users")
@Controller("api/auth")
export class AuthController {
  constructor(
    private readonly userAuthService: AuthService,
    private readonly emailService: SendEmailService,
    private readonly verificationService: VerificationService,
    private readonly sendSMSService: SendMessageServiceService,
    private readonly otpService: OtpService,
  ) {}

  @Post("admin/register")
  @ApiOperation({ summary: "Inscription Administrateur" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        email: { type: "string" },
        adresse: {
          type: "enum",
          enum: [
            "Dakar",
            "Thies",
            "Diourbel",
            "Fatick",
            "Kaffrine",
            "Kaolack",
            "Kedougou",
            "Kolda",
            "Louga",
            "Matam",
            "Saint-Louis",
            "Sedhiou",
            "Tambacounda",
            "Ziguinchor",
          ],
        },
        password: { type: "string" },
        new_password: { type: "string" },
      },
    },
    description: "Inscription Administrateur",
  })
  async registerAdmin(
    @Body()
    body: {
      email: string;
      adresse: string;
      password: string;
      new_password: string;
    },
  ): Promise<{ message: string }> {
    const { email, adresse, password, new_password } = body;
    await this.userAuthService.registerAdmin(
      email,
      adresse,
      password,
      new_password,
    );
    return { message: "Insciption reussie" };
  }

  @Post("company/register")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        email: { type: "string" },
        telephone: { type: "string" },
        adresse: {
          type: "enum",
          enum: [
            "Dakar",
            "Thies",
            "Diourbel",
            "Fatick",
            "Kaffrine",
            "Kaolack",
            "Kedougou",
            "Kolda",
            "Louga",
            "Matam",
            "Saint-Louis",
            "Sedhiou",
            "Tambacounda",
            "Ziguinchor",
          ],
        },
        ninea: { type: "string" },
        password: { type: "string" },
        new_password: { type: "string" },
      },
    },
    description: "Inscription Entreprise",
  })
  async registerCompany(
    @Body() companyInfo: Entreprise,
  ): Promise<{ message: string }> {
    await this.userAuthService.registerCompany(
      companyInfo.email,
      companyInfo.telephone,
      companyInfo.adresse,
      companyInfo.ninea,
      companyInfo.password,
      companyInfo.new_password,
    );
    return {
      message:
        "Inscription reussie, vous recevrez un email dès que le compte sera activé !",
    };
  }

  @Post("particulier/register")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        telephone: { type: "string" },
        birthDate: { type: "string", format: "date" },
        adresse: {
          type: "enum",
          enum: [
            "Dakar",
            "Thies",
            "Diourbel",
            "Fatick",
            "Kaffrine",
            "Kaolack",
            "Kedougou",
            "Kolda",
            "Louga",
            "Matam",
            "Saint-Louis",
            "Sedhiou",
            "Tambacounda",
            "Ziguinchor",
          ],
        },
        password: { type: "string" },
        new_password: { type: "string" },
      },
    },
    description: "Inscription Client",
  })
  async registerClient(
    @Body() clientInfo: Particulier,
  ): Promise<{ message: string; particulier: Particulier }> {
    const result = await this.userAuthService.registerParticulier(
      clientInfo.telephone,
      clientInfo.birthDate,
      clientInfo.adresse,
      clientInfo.password,
      clientInfo.new_password,
    );
    return { message: result.message, particulier: result.particulier };
  }

  @Post("particulier/validateRegister")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        id: { type: "number" },
        codeOtp: { type: "string" },
      },
    },
    description: "Validation Client",
  })
  async validateClientAndRegiseter(
    @Body() body: { id: number; codeOtp: string },
  ): Promise<{ message: string; particulier: Particulier }> {
    const result = await this.userAuthService.verifyOtpParticulierAndRegister(
      body.id,
      body.codeOtp,
    );
    return { message: result.message, particulier: result.particulier };
  }

  @Post("admin/login")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        email: { type: "string" },
        password: { type: "string" },
      },
    },
    description: "Connexion Admin",
  })
  async loginAdmin(
    @Body() body: { email: string; password: string },
  ): Promise<any> {
    const { email, password } = body;
    const result = await this.userAuthService.loginAdmin(email, password);
    // res.cookie('token', result.token, {
    //     httpOnly: true,
    //     secure: false,
    //     sameSite: 'lax',
    //     expires: new Date(Date.now() + 1 * 100 * 100 * 1000),
    //   })
    //   .send({ message: 'Connexion Réussie', user:result.user  });
    return {
      message: "Connexion Réussie",
      token: result.token,
      user: result.user,
    };
  }

  @Post("company/login")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        email: { type: "string" },
        password: { type: "string" },
      },
    },
    description: "Connexion Entreprise",
  })
  async loginCompany(
    @Body() body: { email: string; password: string },
  ): Promise<any> {
    const { email, password } = body;
    const result = await this.userAuthService.loginCompany(email, password);
    // res.cookie('token', result.token, {
    //     httpOnly: true,
    //     secure: false,
    //     sameSite: 'lax',
    //     expires: new Date(Date.now() + 1 * 100 * 100 * 1000),
    //   })
    //   .send({ message: 'Connexion Réussie', user:result.user  });
    return {
      message: "Connexion Réussie",
      token: result.token,
      user: result.user,
    };
  }

  @Post("company/profile/change")
  @UseInterceptors(FileInterceptor("imageProfil"))
  @ApiConsumes("multipart/form-data")
  @UseGuards(CompanyGuard)
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        prenom: { type: "string" },
        nom: { type: "string" },
        telephone: { type: "string" },
        adresse: {
          type: "string",
        },
        sousGroupe: { type: "string" },
        imageProfil: {
          type: "string",
          format: "binary",
        },
      },
    },
    description: "Changement de profil",
  })
  async changeProfilEntreprise(
    @Body()
    companyInfo: {
      prenom: string;
      nom: string;
      telephone: string;
      sousGroupe: string;
      adresse: string;
    },
    @UploadedFile() file: Express.Multer.File,
    @Request() request: { user: { userId: number } },
  ): Promise<{ message: string }> {
    const userId = request["user"].userId;
    await this.userAuthService.changeProfileCompany(
      userId,
      companyInfo.prenom,
      companyInfo.nom,
      companyInfo.telephone,
      companyInfo.sousGroupe,
      companyInfo.adresse,
      file,
    );
    return { message: "Modification Profil réussie ! " };
  }

  @Post("particulier/login")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        telephone: { type: "string" },
        password: { type: "string" },
      },
    },
    description: "Connexion Client",
  })
  async loginParticulier(
    @Body() body: { telephone: string; password: string },
  ): Promise<{ message: string; user: Particulier }> {
    const { telephone, password } = body;
    const result = await this.userAuthService.loginParticulier(
      telephone,
      password,
    );
    return {
      message: result.message,
      user: result.particulier,
    };
  }

  @Post("particulier/validateLogin")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        id: { type: "number" },
        codeOtp: { type: "string" },
      },
    },
    description: "Connexion Client",
  })
  async validateParticulierAndPass(
    @Body() body: { id: number; codeOtp: string },
  ): Promise<{
    message: string;
    accessToken: string;
    refreshToken: string;
    particulier: Particulier;
  }> {
    const result = await this.userAuthService.verifyOtpParticulierAndLogin(
      body.id,
      body.codeOtp,
    );
    return {
      message: "Connexion Réussie",
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      particulier: result.existParticulier,
    };
  }

  @Post("agent/login")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        telephone: { type: "string" },
        password: { type: "string" },
      },
    },
    description: "Connexion Client",
  })
  async loginCaissier(
    @Body() body: { telephone: string; password: string },
  ): Promise<{ message: string; caissier: Caissier }> {
    const { telephone, password } = body;
    const result = await this.userAuthService.loginCaissier(
      telephone,
      password,
    );
    return { message: "Connexion Réussie", caissier: result.caissier };
  }

  @Post("agent/validateLogin")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        id: { type: "number" },
        codeOtp: { type: "string" },
      },
    },
    description: "Connexion Client",
  })
  async validateCaissierAndPass(
    @Body() body: { id: number; codeOtp: string },
  ): Promise<{
    message: string;
    accessToken: string;
    refreshToken: string;
    caissier: Caissier;
  }> {
    const result = await this.userAuthService.verifyOtpCaissierAndLogin(
      body.id,
      body.codeOtp,
    );
    return {
      message: "Connexion Réussie",
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      caissier: result.existCaissier,
    };
  }

  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth()
  @Get("agent/token/refresh")
  refreshTokensCaissier(@Request() request: { user: { sub: number } }) {
    const userId = request["user"].sub;
    console.log("id", userId);
    return this.userAuthService.refreshTokensCaissier(userId);
  }

  @UseGuards(RefreshtokenprticulierGuard)
  @ApiBearerAuth()
  @Get("particulier/token/refresh")
  refreshTokensParticulier(@Request() request: { user: { sub: number } }) {
    const userId = request["user"].sub;
    console.log("id", userId);
    return this.userAuthService.refreshTokensParticulier(userId);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get("admin/verifyCompany/:id")
  async verifyCompanyAccount(@Param("id") id: number) {
    const result = await this.verificationService.verifyCompanyAccount(id);
    return result;
  }

  @Post("admin/reVerifyCompany/")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        email: { type: "string" },
      },
    },
    description: "Reverification Entreprise",
  })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async reVerifyCompanyAccount(@Body() body: { email: string }) {
    const { email } = body;
    const result = await this.verificationService.reVerifyCompanyAccount(email);
    return result;
  }

  @Post("company/resetPassword")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        email: { type: "string" },
      },
    },
    description: "Reinitialisation Mot de passe",
  })
  async sendResetPasswordEmail(
    @Body() body: { email: string },
  ): Promise<{ message: string }> {
    const { email } = body;
    await this.emailService.sendResetPasswordEmail(email);
    return { message: "Un email vous a été envoyé avec succès !" };
  }

  @Post("particulier/resetPassword")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        telephone: { type: "string" },
      },
    },
    description: "Reinitialisation Mot de passe",
  })
  async sendSMSPasswordReset(@Body() body: { telephone: string }) {
    const { telephone } = body;
    await this.userAuthService.resetPassWordParticulier(telephone);
    return { message: "Un code de 6 chiffres vous a ete envoyé par sms !" };
  }

  @Post("particulier/resendOtp")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        telephone: { type: "string" },
      },
    },
  })
  async resendSMSOtp(@Body() body: { telephone: string }) {
    const { telephone } = body;
    await this.userAuthService.resendOtpToNotVerifiedUser(telephone);
    return { message: "Un code de 6 chiffres vous a ete envoyé par sms !" };
  }

  @Post("agent/resendOtp")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        id: { type: "number" },
      },
    },
  })
  async resendSMSOtpToAgent(@Body() body: { id: number }) {
    const { id } = body;
    await this.userAuthService.resendOtpCodeToAgent(id);
    return { message: "Un code de 6 chiffres vous a ete envoyé par sms !" };
  }

  @Post("particulier/password/reset")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        verificationCode: { type: "string" },
        new_password: { type: "string" },
        new_password_conf: { type: "string" },
      },
    },
    description: "Changement du mot de passe",
  })
  async changePasswordParticulier(
    @Body()
    body: {
      verificationCode: string;
      new_password: string;
      new_password_conf: string;
    },
  ): Promise<{ message: string }> {
    const { verificationCode, new_password, new_password_conf } = body;
    await this.userAuthService.changePasswordParticulier(
      verificationCode,
      new_password,
      new_password_conf,
    );
    return { message: "Mot de passe changé avec succès !" };
  }

  @Post("company/password/reset")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        verificationCode: { type: "string" },
        new_password: { type: "string" },
        new_password_conf: { type: "string" },
      },
    },
    description: "Changement du mot de passe",
  })
  async changePassword(
    @Body()
    body: {
      verificationCode: string;
      new_password: string;
      new_password_conf: string;
    },
  ): Promise<{ message: string }> {
    const { verificationCode, new_password, new_password_conf } = body;
    await this.userAuthService.changePasswordCompany(
      verificationCode,
      new_password,
      new_password_conf,
    );
    return { message: "Mot de passe changé avec succès !" };
  }

  @Get("company/profile")
  @UseGuards(CompanyGuard)
  @ApiBearerAuth()
  async getProfileCompany(
    @Request() request: { user: { userId: number } },
  ): Promise<Entreprise> {
    const userId = request["user"].userId;
    return this.userAuthService.getProfilCompany(userId);
  }

  @Get("users")
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getUsers(): Promise<User[]> {
    return this.userAuthService.getUsers();
  }

  @Get("particuliers")
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getParticuliers(): Promise<Particulier[]> {
    return this.userAuthService.getClients();
  }

  @Get("companies")
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getEntreprises(): Promise<Entreprise[]> {
    return this.userAuthService.getEntreprises();
  }

  @Post("agent/otp")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        telephone: { type: "string" },
      },
    },
    description: "verification code",
  })
  async getOTPs(@Body() body: { telephone: string }) {
    return this.otpService.getOtp(body.telephone);
  }

  @Get("admin/verifications")
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
