import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Caissier } from 'src/entities/Caissier.entity';
import { Entreprise } from 'src/entities/Entreprise.entity';
import { Mecanisme } from 'src/entities/Mecanisme.entity';
import { Program } from 'src/entities/Program.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EntrepriseService {
    private readonly logger = new Logger(EntrepriseService.name);
    constructor(@InjectRepository(Mecanisme) private mecanismeModel: Repository<Mecanisme>,
                @InjectRepository(Program) private programModel: Repository<Program>,
                @InjectRepository(Entreprise) private entrepriseModel: Repository<Entreprise>,
                @InjectRepository(Caissier) private caissierModel: Repository<Caissier>
    ){}

    async createAgent(caissierData: Caissier, userId:number){
      const entreprise = await this.entrepriseModel.findOne({where:{id: userId}});

      if (!entreprise) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: 'Entreprise non trouvée',
        }, HttpStatus.NOT_FOUND);
      }
      const existCaissier = await this.caissierModel.findOne({where:{telephone: caissierData.telephone}});
      if (existCaissier) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: 'Utilisateur déja existant, se connecter !',
        }, HttpStatus.NOT_FOUND);
      }
      if (caissierData.password !== caissierData.new_password) {
        throw new HttpException({
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            error: 'les mots de passe ne correspondent pas',
          }, HttpStatus.UNPROCESSABLE_ENTITY)
      }

      const hash = await bcrypt.hash(caissierData.password, 10);
      const hashedPassword = await bcrypt.hash(caissierData.password, hash);
      const newCompanyAccount = await this.caissierModel.save({
        prenom: caissierData.prenom,
        nom: caissierData.nom,
        email: caissierData.email,
        telephone: caissierData.telephone,
        entreprise: entreprise, 
        password : hashedPassword,
        verified: false,
        new_password : hashedPassword,
        createdAt: new Date()
   });     
      //  await this.verificationModel.save({
      //    token: this.randomString(50),
      //    user: newCompanyAccount,
      //    type: 'Creating New Account',
      //  });
    //  await this.sendEmailService.sendWelcomeEmail(email);
   return { message: "Création de compte réussie réussie !", newCompanyAccount};
}

    async createMecanisme(mecanismeData: Mecanisme, userId: number) : Promise<{message:string, mecanisme:Mecanisme}> {
        const entreprise = await this.entrepriseModel.findOne({where:{id: userId}});

          if (!entreprise) {
            throw new HttpException({
              status: HttpStatus.NOT_FOUND,
              error: 'Entreprise non trouvée',
            }, HttpStatus.NOT_FOUND);
          }
          mecanismeData.entreprise = entreprise;
       const newMecanisme = await this.mecanismeModel.save(mecanismeData)
        return {message: ' Mécanisme crée avec succès !', mecanisme: newMecanisme}
    }

    async updateMecanisme(id:number, mecanismeData:Mecanisme): Promise<{message:string, Mecanisme: Mecanisme}>{
        const existingMecanisme = await this.mecanismeModel.findOne({where:{id:id}})
         if (!existingMecanisme) {
            throw new HttpException({
            status: HttpStatus.NOT_FOUND,
            error: 'Mécanisme introuvable',
            }, HttpStatus.NOT_FOUND);
        }

        Object.assign(existingMecanisme,mecanismeData);
        const majMecanisme =  await this.mecanismeModel.save(existingMecanisme);
        return { message: 'Mécanisme modifié avec succès !', Mecanisme: majMecanisme };
    }

    async deleteMecanisme(id: number): Promise<{ message: string }> {
        const existingMecanisme = await this.mecanismeModel.findOne({where:{id:id}});

        if (!existingMecanisme) {
            throw new HttpException({
            status: HttpStatus.NOT_FOUND,
            error: 'Mécanisme introuvable',
            }, HttpStatus.NOT_FOUND);
        }

        await this.mecanismeModel.remove(existingMecanisme);
        return { message: 'Mécanisme supprimé avec succès !' };
    }

    async getMecanismes(userId:number): Promise<Mecanisme[]> {
      try {
        const entreprise = await this.entrepriseModel.findOne({where:{id: userId}});
        const bons = await this.mecanismeModel.find({where:{entreprise:entreprise}});
        return bons;
      } catch (error) {
        this.logger.error(`Erreur lors de la récuperation des mécanismes: ${error.message}`);
        throw new Error('Erreur lors de la récuperation des mécanismes');
      }
  }

  async createProgramme(programData: Program, userId: number): Promise<{ message: string; programme: Program }> {
    const entreprise = await this.entrepriseModel.findOne({ where: { id: userId } });
    const existingProgram = await this.programModel.findOne({ where: { nomProgram: programData.nomProgram} });
    if (existingProgram) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'Ce programme existe déja !',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    if (!entreprise) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Entreprise non trouvée',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    programData.entreprise = entreprise;

    const newProgram = await this.programModel.save(programData);
    return { message: ' Programme créé avec succès !', programme: newProgram };
  }

  

  async activateProgramme(id: number): Promise<{ message: string }> {
        const existingProgram = await this.programModel.findOne({where:{id:id}});

        if (!existingProgram) {
            throw new HttpException({
            status: HttpStatus.NOT_FOUND,
            error: 'Programme introuvable',
            }, HttpStatus.NOT_FOUND);
        }
        if(existingProgram.isActive == true) {
          throw new HttpException({
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            error: 'Programme déja activé !',
            }, HttpStatus.UNPROCESSABLE_ENTITY);
        }
        var today = new Date();
        var DD = today.getDate();
        var MM = today.getMonth();
        var YYYY = today.getFullYear();
        var hh = today.getHours();
        var mm = today.getMinutes();
        var ss = today.getSeconds();
        var todayDateTime = new Date(YYYY, MM, DD, hh, mm, ss)
        existingProgram.isActive = true;
        existingProgram.dateActivation = todayDateTime;
        await this.programModel.save(existingProgram);
        return { message: 'Programme activé avec succès !' };
    }

  async desactivateProgramme(id: number): Promise<{ message: string }> {
        const existingProgram = await this.programModel.findOne({where:{id:id}});

        if (!existingProgram) {
            throw new HttpException({
            status: HttpStatus.NOT_FOUND,
            error: 'Programme introuvable',
            }, HttpStatus.NOT_FOUND);
        }
        if(existingProgram.isActive == false) {
          throw new HttpException({
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            error: 'Programme déja désactivé !',
            }, HttpStatus.UNPROCESSABLE_ENTITY);
        }
        existingProgram.isActive = false;
        await this.programModel.save(existingProgram);
        return { message: 'Programme desactivé avec succès !' };
    }

    async deleteProgramme(id: number): Promise<{ message: string }> {
        const existingProgram = await this.programModel.findOne({where:{id:id}});

        if (!existingProgram) {
            throw new HttpException({
            status: HttpStatus.NOT_FOUND,
            error: 'Programme introuvable',
            }, HttpStatus.NOT_FOUND);
        }

        await this.programModel.remove(existingProgram);
        return { message: 'Programme supprimé avec succès !' };
    }

   async getProgrammes(userId:number): Promise<Program[]> {
      try {
        const entreprise = await this.entrepriseModel.findOne({where:{id: userId}});
        const programmes = await this.programModel.find({where:{entreprise:entreprise}});
        return programmes;
      } catch (error) {
        this.logger.error(`Erreur lors de la récuperation des programmes: ${error.message}`);
        throw new Error('Erreur lors de la récuperation des programmes');
    }
  }

  async getCaissiers(entrepriseId: number): Promise<Caissier[]> {
    try {
      const existEntreprise = await this.entrepriseModel.find({where: {id: entrepriseId}});
      const caissiers = await this.caissierModel.find({where: {entreprise: existEntreprise}});
      return caissiers;
    } catch (error) {
      this.logger.error(`Erreur lors du chargement des caissiers: ${error.message}`);
      throw new Error('Erreur lors du chargement des caissiers');
    }
  }

  

}
