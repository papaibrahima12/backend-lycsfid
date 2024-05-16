import { Injectable, Logger, UnauthorizedException, HttpException, HttpStatus, NotAcceptableException, ForbiddenException, UnprocessableEntityException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/User.entity';
import { Entreprise } from 'src/entities/Entreprise.entity';
import { Particulier } from 'src/entities/Particulier.entity';
import { Verification } from 'src/entities/Verification.entity';
import { SendEmailService } from './send-email.service';
import * as AWS from 'aws-sdk';
import * as argon2 from 'argon2';
import { Caissier } from 'src/entities/Caissier.entity';
import { SendMessageServiceService } from './sendmessageservice.service';
import { OtpService } from './otp.service';
import { ConfigService } from '@nestjs/config';
import { HttpStatusCode } from 'axios';

@Injectable()
export class AuthService {
     private readonly logger = new Logger(AuthService.name);

  constructor(@InjectRepository(User) private userRepository: Repository<User>,
               @InjectRepository(Entreprise) private entrepriseRepository: Repository<Entreprise>,
               @InjectRepository(Particulier) private particulierRepository: Repository<Particulier>,
               @InjectRepository(Verification) private readonly verificationRepository: Repository<Verification>,
               @InjectRepository(Caissier) private readonly caissierRepository: Repository<Caissier>,
               private readonly configService: ConfigService,
              private jwtService: JwtService, private sendEmailService:SendEmailService,private otpService: OtpService, private sendMessService: SendMessageServiceService) {}
 
  async registerAdmin(email: string, adresse:string, password: string, new_password:string): Promise<{ message: string }> {
     const user = await this.userRepository.findOne({ where:{ email: email }});
      if (user) {
        throw new HttpException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'Cet utilisateur existe déjà',
        }, HttpStatus.UNPROCESSABLE_ENTITY)
      }
      const hash = await bcrypt.hash(password, 10);
      await this.userRepository.save({ email,adresse, password: hash, new_password:hash });
      await this.sendEmailService.sendWelcomeEmail(email);
      return { message: 'Inscription Reussie' };
 }

 async registerCompany(email: string, telephone: string,adresse: string, ninea: string, password: string, new_password:string): Promise<{ message: string}> {
     const user = await this.entrepriseRepository.findOne({ where:{ email:email }});
      if (user) {
        throw new HttpException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'Ce partenaire existe déjà',
        }, HttpStatus.UNPROCESSABLE_ENTITY)
      }
      if (password !== new_password) {
      throw new HttpException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'les mots de passe ne correspondent pas',
        }, HttpStatus.UNPROCESSABLE_ENTITY)
    }
      const hash = await bcrypt.hash(password, 10);
      const hashedPassword = await bcrypt.hash(password, hash);
      const newCompanyAccount = await this.entrepriseRepository.save({
           telephone : telephone,
           email : email,
           adresse: adresse, 
           ninea : ninea,
           password : hashedPassword,
           new_password : hashedPassword,
      });      
          await this.verificationRepository.save({
            token: this.randomString(50),
            user: newCompanyAccount,
            type: 'Creating New Account',
          });
        await this.sendEmailService.sendWelcomeEmail(email);
      return { message: "Inscription Réussie, votre compte est en cours d'activation ! Vous recevrez un mail !"};
 }

 async registerParticulier(telephone: string,birthDate: Date, adresse:string, password: string,new_password:string): Promise<{ message: string, particulier: Particulier}> {
     const user = await this.particulierRepository.findOne({ where:{telephone:telephone, verified:true }});
      if (user) {
        throw new HttpException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'Ce numero existe déjà',
        }, HttpStatus.UNPROCESSABLE_ENTITY)
      }
      if(telephone == "" || telephone == null){
        throw new HttpException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'le telephone est requis',
        }, HttpStatus.UNPROCESSABLE_ENTITY)
      }
      if (password !== new_password) {
      throw new HttpException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'les mots de passe ne correspondent pas',
        }, HttpStatus.UNPROCESSABLE_ENTITY)
    }
      const hash = await bcrypt.hash(password, 10);
      const hashedPassword = await bcrypt.hash(password, hash);
     const newParticulier = await this.particulierRepository.save({
           telephone : telephone,
           adresse : adresse,
           birthDate: birthDate,
           password : hashedPassword,
           new_password : hashedPassword,
           verified: false
      });
      await this.sendMessService.sendSMSOTP(telephone);
      return { message: "Un sms vous a été envoyé, veuillez validez votre compte !", particulier: newParticulier};
 }

 async verifyOtpParticulierAndRegister(id: number, enteredOtp: string): Promise<{message: string, particulier: Particulier }>{
  const existParticulier = await this.particulierRepository.findOne({ where:{id: id, verified: false} });
  if (!existParticulier) {
    throw new HttpException({
      status: HttpStatus.NOT_FOUND,
      error: "Compte inexistant, veuillez vous inscrire svp !",
    }, HttpStatus.NOT_FOUND)
  }
  const optStored = this.otpService.getOtp(existParticulier.telephone);
  if (optStored !== enteredOtp) {
      throw new UnauthorizedException('Code OTP incorrect ou expiré !');
  }

  existParticulier.verified = true;
  existParticulier.verifiedAt =new Date();

  await this.particulierRepository.save(existParticulier);

  return { message: 'Inscription Réussie, votre compte a bien été activé', particulier: existParticulier };
}

  hashData(data: string) {
    return argon2.hash(data);
  }

  verifyData(digest:string, data:string) {
    return argon2.verify(digest, data);
  }

  async loginAdmin(email: string, password: string): Promise<{ token: string; user: User }> {
      const user = await this.userRepository.findOne({ where:{ email: email }});
      if (!user) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: "Cet utilisateur n'existe pas",
        }, HttpStatus.NOT_FOUND)
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new UnauthorizedException('Mot de passe incorrect');
      }
      const payload = { userId: user.id, role: user.role };
      const token = this.jwtService.sign(payload); 
      return {token,user};
  }

  async loginCompany(email: string, password: string): Promise<{ token: string; user: Entreprise }> {
      const user = await this.entrepriseRepository.findOne({ where:{ email: email} });
      if (!user) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: "Compte inexistant, veuillez vous inscrire svp !",
        }, HttpStatus.NOT_FOUND)
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new UnauthorizedException('Mot de passe incorrect');
      }
      if (user.verified == false){
          throw new UnauthorizedException("Votre compte n'est pas encore activé !");
      }
      const secret = this.configService.get<string>('key.access');
      const payload = { userId: user.id, role:user.role, user:user };
      const token = this.jwtService.sign(payload, {secret} );
      return {token,user};
  }

  async validatePartner(email:string,password:string){
    const user = await this.getPartner(email);
    const passwordValid = await bcrypt.compare(password, user.password)
        if (!user) {
            throw new NotAcceptableException('could not find the user');
          }
        if (user && passwordValid) {
          return user;
        }
        return null;
  }

  async loginParticulier(telephone: string, password: string, deviceId: string): Promise<any> {
      const user = await this.particulierRepository.findOne({ where:{telephone: telephone} });
      if (!user) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: "Compte inexistant ou non vérifié, veuillez vous inscrire svp !",
        }, HttpStatus.NOT_FOUND)
      }
      if(deviceId == null  || deviceId == '') {
        throw new UnprocessableEntityException({
          status: HttpStatusCode.UnprocessableEntity,
          error: "le device Id est requis !",
        }, "Le device est requis")
        }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new UnauthorizedException('Mot de passe incorrect');
      }
      await this.sendMessService.sendSMSOTP(telephone);
      user.deviceId = deviceId;
      await this.particulierRepository.save(user);
    return {message:'Un code de validation vous a été envoyé par SMS, Veuillez le saisir !', particulier: user};
  }

  async verifyOtpParticulierAndLogin(id: number, enteredOtp: string): Promise<{ accessToken: string, refreshToken:string, existParticulier: Particulier }>{
    const existParticulier = await this.particulierRepository.findOne({ where:{id: id, verified: true} });
    if (!existParticulier) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: "Compte inexistant, veuillez vous inscrire svp !",
      }, HttpStatus.NOT_FOUND)
    }
    const optStored = this.otpService.getOtp(existParticulier.telephone);
    if (optStored !== enteredOtp) {
        throw new UnauthorizedException('Code OTP incorrect ou expiré !');
    }  
    const tokens = this.getTokens(existParticulier.id, existParticulier.telephone, existParticulier.role);

    existParticulier.refreshToken = (await tokens).refreshToken;
    const accessToken = (await tokens).accessToken;
    const refreshToken = (await tokens).refreshToken;
    await this.particulierRepository.save(existParticulier);
  
    return { accessToken, refreshToken, existParticulier };
  }

  async loginCaissier(telephone: string, password: string): Promise<any> {
    const caissier = await this.caissierRepository.findOne({ where:{telephone: telephone},  relations: ['entreprise'] });
    if (!caissier) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: "Compte inexistant, veuillez vous inscrire svp !",
      }, HttpStatus.NOT_FOUND)
    }
    const passwordMatch = await bcrypt.compare(password, caissier.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Mot de passe incorrect');
    }
    this.sendMessService.sendSMSOTP(telephone);
    return {message:'Un code OTP vous a été envoyé par SMS !', caissier: caissier};
}

  async verifyOtpCaissierAndLogin(id: number, enteredOtp: string): Promise<{accessToken: string, refreshToken:string,existCaissier: Caissier }>{
    const existCaissier = await this.caissierRepository.findOne({ where:{id: id} });
    if (!existCaissier) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: "Compte inexistant, veuillez vous inscrire svp !",
      }, HttpStatus.NOT_FOUND)
    }
    const optStored = this.otpService.getOtp(existCaissier.telephone);
    if (optStored !== enteredOtp) {
        throw new UnauthorizedException('Code OTP incorrect ou expiré');
    }

    const tokens = this.getTokens(existCaissier.id, existCaissier.telephone, existCaissier.role);
    const accessToken = (await tokens).accessToken;
    const refreshToken = (await tokens).refreshToken;
    const hashedRefreshToken = await this.hashData(refreshToken);
    existCaissier.refreshToken = hashedRefreshToken;
    existCaissier.verified == true;
    await this.caissierRepository.save(existCaissier);

    return { accessToken, refreshToken, existCaissier };
  }

  async resetPassWordParticulier(telephone: string): Promise<any>{
    const existParticulier = await this.particulierRepository.findOne({ where:{telephone: telephone} });
    if (!existParticulier) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: "Compte inexistant, veuillez vous inscrire svp !",
      }, HttpStatus.NOT_FOUND)
    }

    await this.sendMessService.sendSMSOTP(telephone);

    const optStored = this.otpService.getOtp(existParticulier.telephone);
    console.log('Otp stpred', optStored);
    existParticulier.verificationCode = optStored;
    await this.particulierRepository.save(existParticulier);
    if (!optStored) {
        throw new UnauthorizedException('Code OTP incorrect ou expiré');
    }

    return { message: 'Un code de 6 chiffres vous a ete envoyé par sms'};
  }


  async changePasswordParticulier(verificationCode:string, new_password:string, new_password_conf: string):Promise<{ message: string}>{
    const existParticulier= await this.particulierRepository.findOne({ where:{verificationCode:verificationCode }});
      if (!existParticulier) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: "Ce code n'existe pas",
        }, HttpStatus.NOT_FOUND)
      }
      if (new_password != new_password_conf){
        throw new HttpException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'les mots de passe ne correspondent pas',
        }, HttpStatus.UNPROCESSABLE_ENTITY)
      }

      const hash = await bcrypt.hash(new_password, 10);
      const hashedPassword = await bcrypt.hash(new_password, hash);

      existParticulier.password = hashedPassword;
      existParticulier.new_password = hashedPassword;
      existParticulier.verificationCode = null;
      this.particulierRepository.save(existParticulier);
      return { message: "Mot de passe modifié avec succès!"};
  }

  async resendOtpToNotVerifiedUser(telephone: string): Promise<any>{
    const existUser = await this.particulierRepository.findOne({ where:{telephone:telephone }});
      if (!existUser) {
        throw new HttpException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: "Cet utilisateur n'existe pas !",
        }, HttpStatus.UNPROCESSABLE_ENTITY)
      }
      if(telephone == "" || telephone == null){
        throw new HttpException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'le telephone est requis',
        }, HttpStatus.UNPROCESSABLE_ENTITY)
      }
      await this.sendMessService.sendSMSOTP(telephone);
      return { message: "Un sms vous a été envoyé, veuillez validez votre compte !"};
  }

  async resendOtpCodeToAgent(id: number){
    const agent = await this.caissierRepository.findOne({where: {id: id}});
    if (! agent){
      throw new HttpException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        error: "Cet utilisateur n'existe pas !",
      }, HttpStatus.UNPROCESSABLE_ENTITY)
    }
    const tel = agent.telephone;
    this.sendMessService.sendSMSOTP(tel);
    return { message: "Un sms vous a été renvoyé, veuillez validez votre compte !"};
  }



  async changePasswordCompany(verificationCode:string, new_password:string, new_password_conf: string):Promise<{ message: string}>{
    const company= await this.entrepriseRepository.findOne({ where:{verificationCode:verificationCode }});
      if (!company) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: "Ce code n'existe pas",
        }, HttpStatus.NOT_FOUND)
      }
      if (new_password != new_password_conf){
        throw new HttpException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'les mots de passe ne correspondent pas',
        }, HttpStatus.UNPROCESSABLE_ENTITY)
      }

      const hash = await bcrypt.hash(new_password, 10);
      const hashedPassword = await bcrypt.hash(new_password, hash);

      company.password = hashedPassword;
      company.new_password = hashedPassword;
      company.verificationCode = null;
      this.entrepriseRepository.save(company);
      return { message: "Mot de passe modifié avec succès!"};
  }

  async changeProfileCompany(id: number, prenom:string, nom:string, telephone: string, sousGroupe:string,adresse: string, file?: Express.Multer.File){
    const existEntreprise = await this.entrepriseRepository.findOne({where: {id: id}});
    if (!existEntreprise) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: "Cet entreprise n'existe pas",
      }, HttpStatus.NOT_FOUND)
    }
      if(!file){
        existEntreprise.imageProfil = 'default.png';
      }else{
        const uploadedImage = await this.upload(file);
        existEntreprise.imageProfil = uploadedImage;
      }
      existEntreprise.prenom = prenom;
      existEntreprise.nom = nom;
      existEntreprise.telephone = telephone;
      existEntreprise.adresse = adresse;
      existEntreprise.sousGroupe = sousGroupe;
    await this.entrepriseRepository.save(existEntreprise);
    return {message: 'Profil modifié avec succès !'};
  // }else{
  //       throw new HttpException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         error: 'Vous devez charger une image',
  //       }, HttpStatus.UNPROCESSABLE_ENTITY)
  //   }

  }

  async getProfilCompany(id: number): Promise<Entreprise> {
    try {
      const entreprise = await this.entrepriseRepository.findOne({where:{id:id}});
      return entreprise;
    } catch (error) {
      this.logger.error(`Erreur lors du chargement des entreprises: ${error.message}`);
      throw new Error('Erreur lors du chargement des entreprises');
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      const users = await this.userRepository.find({});
      return users;
    } catch (error) {
      this.logger.error(`Erreur lors du chargement des utilisateurs: ${error.message}`);
      throw new Error('Erreur lors du chargement des utilisateurs');
    }
  }

  async getVerifications(): Promise<Verification[]> {
    try {
      const verifications = await this.verificationRepository.find({});
      return verifications;
    } catch (error) {
      this.logger.error(`Erreur lors du chargement des verifications: ${error.message}`);
      throw new Error('Erreur lors du chargement des verifications');
    }
  }

  async getEntreprises(): Promise<Entreprise[]> {
    try {
      const entreprises = await this.entrepriseRepository.find({});
      return entreprises;
    } catch (error) {
      this.logger.error(`Erreur lors du chargement : ${error.message}`);
      throw new Error('Erreur lors du chargement ');
    }
  }

  async getClients(): Promise<Particulier[]> {
    try {
      const particuliers = await this.particulierRepository.find({});
      return particuliers;
    } catch (error) {
      this.logger.error(`Erreur lors du chargement : ${error.message}`);
      throw new Error('Erreur lors du chargement ');
    }
  }

  private randomString(length: number): string {
    let result = "";
    let characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async getPartner(email:string){
    const emailPartenaire = email.toLowerCase();
    const user = await this.entrepriseRepository.findOne({ where:{ email: emailPartenaire} });
    return user;
  }

  async getProfilPartner(id:number): Promise<Particulier>{
    try {
      const particulier = await this.particulierRepository.findOne({where:{id: id}});
      return particulier;
    } catch (error) {
      this.logger.error(`Erreur lors du chargement : ${error.message}`);
      throw new Error('Erreur lors du chargement ');
    }
  }

  async upload(file): Promise<string> {
    const { originalname } = file ;
    const bucketS3 = 'lycsalliofiles';
    return this.uploadS3(file.buffer, bucketS3, originalname);
}

  async uploadS3(file,bucket, name): Promise<string> {
    const s3 = this.getS3();
    const params = {
        Bucket: bucket,
        Key: String(name),
        acl: 'private',
        Body: file,
    };
    return new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
        if (err) {
            Logger.error(err);
            reject(err.message);
        }
        resolve(data.Location);
        });
    });
}

  getS3() {
    return new AWS.S3({
        accessKeyId: process.env.accessKEY,
        secretAccessKey: process.env.secretAccessKey,
    });
  }

  async getTokens(userId: number, telephone: string, role: string) {
    const acc_key = this.configService.get<string>('key.access');
    const ref_key = this.configService.get<string>('key.refresh');
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          telephone,
          role
        },
        {
          secret: acc_key,
          expiresIn: '2h',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          telephone,
          role
        },
        {
          secret: ref_key,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshTokenParticulier(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    const existParticulier = await this.particulierRepository.findOne({where: {id: userId}});
    if (!existParticulier) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: "Cet entreprise n'existe pas",
      }, HttpStatus.NOT_FOUND)
    }
    existParticulier.refreshToken = hashedRefreshToken;
    await this.particulierRepository.save(existParticulier);
  }

  async updateRefreshTokenCaissier(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    const existCaissier = await this.caissierRepository.findOne({where: {id: userId}});
    console.log('existCaissier',existCaissier);
    if (!existCaissier) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: "Cet agent n'existe pas",
      }, HttpStatus.NOT_FOUND)
    }
    existCaissier.refreshToken = hashedRefreshToken;
    await this.caissierRepository.save(existCaissier);
    console.log(existCaissier.refreshToken);
  }


  async refreshTokensParticulier(userId: number) {
    const existParticulier = await this.particulierRepository.findOne({where: {id: userId}});
    if (!existParticulier || !existParticulier.refreshToken)
      throw new ForbiddenException('Accès non authorisé !');
    // const refreshTokenMatches = await argon2.verify(
    //   existParticulier.refreshToken,
    //   refreshToken,
    // );
    // if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(existParticulier.id, existParticulier.telephone, existParticulier.role);
    await this.updateRefreshTokenParticulier(existParticulier.id, tokens.refreshToken);
    return tokens;
  }

  async refreshTokensCaissier(userId: number) {
    const existCaissier = await this.caissierRepository.findOne({where: {id: userId}});
    console.log(existCaissier);
    if (!existCaissier)
      throw new ForbiddenException('Accès non authorisé !');
    const tokens = await this.getTokens(existCaissier.id, existCaissier.telephone, existCaissier.role);
    await this.updateRefreshTokenCaissier(existCaissier.id, tokens.refreshToken);
    return tokens;
  }

}
