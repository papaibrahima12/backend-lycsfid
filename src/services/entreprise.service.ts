import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Caissier } from 'src/entities/Caissier.entity';
import { Entreprise } from 'src/entities/Entreprise.entity';
import { Mecanisme } from 'src/entities/Mecanisme.entity';
import { Particulier } from 'src/entities/Particulier.entity';
import { Program } from 'src/entities/Program.entity';
import { Recompense } from 'src/entities/Recompense.entity';
import { StatsRecompenses } from 'src/entities/StatsRecompenses.entity';
import { NotificationService } from 'src/notification/notification.service';
import { Repository } from 'typeorm';

@Injectable()
export class EntrepriseService {
    private readonly logger = new Logger(EntrepriseService.name);
    constructor(@InjectRepository(Mecanisme) private mecanismeModel: Repository<Mecanisme>,
                @InjectRepository(Program) private programModel: Repository<Program>,
                @InjectRepository(Entreprise) private entrepriseModel: Repository<Entreprise>,
                @InjectRepository(Caissier) private caissierModel: Repository<Caissier>,
                @InjectRepository(Recompense) private recompenseModel: Repository<Recompense>,
                @InjectRepository(Particulier) private particulierModel: Repository<Particulier>,
                @InjectRepository(StatsRecompenses) private statsRecompensesModel: Repository<StatsRecompenses>,
                private readonly sendingNotificationService: NotificationService

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
      const newCaissierAccount = await this.caissierModel.save({
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
   return { message: "Création de compte réussie réussie !", newCaissierAccount};
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

    async createRecompense(id: number, recompenseData: Recompense): Promise<{message:string, recompense:Recompense}>{
      let nbreRecomp = 0;
      const entreprise = await this.entrepriseModel.findOne({where:{id: id}});

      if (!entreprise) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: 'Entreprise non trouvée',
        }, HttpStatus.NOT_FOUND);
      }
      recompenseData.entreprise = entreprise;
      const newRecompense = await this.recompenseModel.save(recompenseData);
      nbreRecomp = nbreRecomp + 1;
      await this.statsRecompensesModel.save({
        nombreBons: nbreRecomp,
        dateCreation: new Date(),
        entreprise: entreprise
      });
      const particuliers = await this.particulierModel.find({});
          for (let existParticulier of particuliers) {
            const recompenses = await this.recompenseModel.find({where: {statut: 'actif' }});
           
            if (recompenses.length > 0) {
              await this.sendingNotificationService.sendingNotificationOneUser(
                "Nouvelles Récompenses",
                "Une nouvelle récompense est disponible 😊 !",
                existParticulier.deviceId,
              );
            }
        }
      return {message: ' Récompense créee avec succès !', recompense: newRecompense}
    }

    async changeStatusRecompense(id: number): Promise<{ message: string }> {
      const existRecompense = await this.recompenseModel.findOne({where:{id:id}});

      if (!existRecompense) {
          throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: 'Récompense introuvable',
          }, HttpStatus.NOT_FOUND);
      }
      if(existRecompense.statut == 'actif') {
        existRecompense.dateActivation = todayDateTime;
        existRecompense.statut = 'inactif';
        await this.recompenseModel.save(existRecompense);
      }else{
        var today = new Date();
        var DD = today.getDate();
        var MM = today.getMonth();
        var YYYY = today.getFullYear();
        var hh = today.getHours();
        var mm = today.getMinutes();
        var ss = today.getSeconds();
        var todayDateTime = new Date(YYYY, MM, DD, hh, mm, ss)
        existRecompense.statut = 'actif';
        existRecompense.dateActivation = todayDateTime;
        await this.recompenseModel.save(existRecompense);
      }
      return { message: 'Statut Récompense changée avec succès !' };
    }

    async desactivateRecompense(id: number): Promise<{ message: string }> {
      const existRecompense = await this.recompenseModel.findOne({where:{id:id}});

      if (!existRecompense) {
          throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: 'Récompense introuvable',
          }, HttpStatus.NOT_FOUND);
      }
      if(existRecompense.statut == 'inactif') {
        throw new HttpException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'Récompense déja désactivée !',
          }, HttpStatus.UNPROCESSABLE_ENTITY);
      }
      existRecompense.statut = 'inactif';
      await this.recompenseModel.update(id, existRecompense);
      return { message: 'Récompense desactivée avec succès !' };
    }

    async getRecompenses(userId:number): Promise<Recompense[]> {
      try {
        const entreprise = await this.entrepriseModel.findOne({where:{id: userId}});
        const recompenses = await this.recompenseModel.find({where:{entreprise:entreprise}});
        return recompenses;
      } catch (error) {
        console.error(error);
        this.logger.error(`Erreur lors de la récuperation des recompenses: ${error.message}`);
        throw new Error('Erreur lors de la récuperation des recompenses');
    }
  }

  

}
