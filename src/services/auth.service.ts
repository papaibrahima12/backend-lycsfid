import { Injectable, Logger, UnauthorizedException, HttpException, HttpStatus, NotAcceptableException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/User.entity';
import { Entreprise } from 'src/entities/Entreprise.entity';
import { Particulier } from 'src/entities/Particulier.entity';
import { Verification } from 'src/entities/Verification.entity';
import { SendEmailService } from './send-email.service';

@Injectable()
export class AuthService {
     private readonly logger = new Logger(AuthService.name);
  constructor(@InjectRepository(User) private userRepository: Repository<User>,
               @InjectRepository(Entreprise) private entrepriseRepository: Repository<Entreprise>,
               @InjectRepository(Particulier) private particulierRepository: Repository<Particulier>,
               @InjectRepository(Verification) private readonly verificationRepository: Repository<Verification>,
              private jwtService: JwtService, private sendEmailService:SendEmailService) {}
 
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

 async registerParticulier(telephone: string,birthDate: Date, adresse:string, password: string,new_password:string): Promise<{ message: string}> {
     const user = await this.particulierRepository.findOne({ where:{telephone:telephone }});
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
      await this.particulierRepository.save({
           telephone : telephone,
           adresse : adresse,
           birthDate: birthDate,
           password : hashedPassword,
           new_password : hashedPassword,
      });
      return { message: "Inscription Réussie, veuillez vous connecter !"};
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
      const user = await this.entrepriseRepository.findOne({ where:{email: email} });
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
      const payload = { userId: user.id, role:user.role };
      const token = this.jwtService.sign(payload);
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

  async loginParticulier(telephone: string, password: string): Promise<{ token: string; user: Particulier }> {
      const user = await this.particulierRepository.findOne({ where:{telephone: telephone} });
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
      const payload = { userId: user.id, role:user.role };
      const token = this.jwtService.sign(payload); 
      return {token,user};
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

  async changePasswordParticulier(){}

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
}
