import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Bon } from 'src/entities/Bon.entity';
import { Campagne } from 'src/entities/Campagne.entity';
import { Entreprise } from 'src/entities/Entreprise.entity';
import { Historique } from 'src/entities/Historique.entity';
import { Particulier } from 'src/entities/Particulier.entity';
import { PointParEntreprise } from 'src/entities/PointParEntreprise.entity';
import { Program } from 'src/entities/Program.entity';
import { Recompense } from 'src/entities/Recompense.entity';
import { RecompensePart } from 'src/entities/RecompensePart';
import { NotificationService } from 'src/notification/notification.service';
import { Repository } from 'typeorm';

@Injectable()
export class ParticulierService {
     private readonly logger = new Logger(ParticulierService.name);
    constructor(@InjectRepository(Bon) private bonModel: Repository<Bon>,
                @InjectRepository(Campagne) private campagneModel: Repository<Campagne>,
                @InjectRepository(Program) private programModel: Repository<Program>,
                @InjectRepository(Entreprise) private entrepriseModel: Repository<Entreprise>,
                @InjectRepository(Particulier) private particulierModel: Repository<Particulier>,
                @InjectRepository(PointParEntreprise) private pointModel: Repository<PointParEntreprise>,   
                @InjectRepository(Historique) private historiqueModel: Repository<Historique>,
                @InjectRepository(Recompense) private recompenseModel: Repository<Recompense>,
                @InjectRepository(RecompensePart) private recompensePartModel: Repository<RecompensePart>,
                private readonly sendingNotificationService: NotificationService
                ){}
      
                async getBons(id: number): Promise<Bon[]> {
                  try {
                    const existParticulier = await this.particulierModel.findOne({ where: { id: id } });
                    if (!existParticulier) {
                      throw new Error('Compte inexistant, veuillez vous inscrire !');
                    }
                
                    const currentDate = new Date();
                    const ageMilliseconds = currentDate.getTime() - new Date(existParticulier.birthDate).getTime();
                    const ageYears = ageMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
                
                    // const adresse = existParticulier.adresse;
                    // console.log('addr part', adresse);
                    const sexe = existParticulier.sexe;
                    
                    const bons = await this.bonModel.find({ where: { isActive: true, sexeCible: sexe }, relations: ['entreprise'] });
                
                    const filteredBons = bons.filter(bon => {
                    const ageMatch = ageYears >= bon.ageCibleMin && ageYears <= bon.ageCibleMax;
                    // const localisationArray: string[] = bon.localisation;
                    // console.log('localisation', localisationArray);
                    // if (!Array.isArray(localisationArray)) {
                    //   console.error('Invalid localisation format');
                    //   return false; // Skip this bon if localisation is not an array
                    // }
                    //   const locationMatch = localisationArray.filter(loc => loc.name === adresse);
                    // Split localisation string into an array of locations
                  // const localisationArray: string[] = bon.localisation.split(',');

                  // Check if the adresse is in the localisation array
                  // const locationMatch = localisationArray.includes(adresse)
                  // console.log('loc',locationMatch);
                      
                      return ageMatch;
                    });
                
                    return filteredBons;
                  } catch (error) {
                    console.error(error);
                    this.logger.error(`Erreur lors de la recuperation des bons !: ${error.message}`);
                    throw new Error('Erreur lors de la recuperation des bons !');
                  }
                }
                

  async getCampagnes(id: number): Promise<Campagne[]> {
      try {
        const existParticulier = await this.particulierModel.findOne({ where: { id: id } });
        if (!existParticulier) {
          throw new Error('Compte inexistant, veuillez vous inscrire !');
        }

        const currentDate = new Date();
        const ageMilliseconds = currentDate.getTime() - new Date(existParticulier.birthDate).getTime();
        const ageYears = ageMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
    
        // const adresse = existParticulier.adresse;
        const sexe = existParticulier.sexe;
        
        const campagnes = await this.campagneModel.find({ where: { isActive: true, status: 'en cours', sexeCible: sexe }, relations: ['entreprise'] });
        console.log('campagnes', campagnes);
        const filteredcampagnes = campagnes.filter(campagne => {
        const ageMatch = ageYears >= campagne.ageCibleMin && ageYears <= campagne.ageCibleMax;
        // const localisationArray: string[] = bon.localisation;
        // console.log('localisation', localisationArray);
        // if (!Array.isArray(localisationArray)) {
        //   console.error('Invalid localisation format');
        //   return false; // Skip this bon if localisation is not an array
        // }
        //   const locationMatch = localisationArray.filter(loc => loc.name === adresse);
        // Split localisation string into an array of locations
      // const localisationArray: string[] = bon.localisation.split(',');

      // Check if the adresse is in the localisation array
      // const locationMatch = localisationArray.includes(adresse)
      // console.log('loc',locationMatch);
          
          return ageMatch;
        });
    
        return filteredcampagnes;
      } catch (error) {
        console.error(error);
        this.logger.error(`Erreur lors de la recuperation des bons !: ${error.message}`);
        throw new Error('Erreur lors de la recuperation des bons !');
      }
  }
  
  async getPrograms(): Promise<Program[]> {
      try {
        const programmes = await this.programModel.find({where:{isActive:true},  relations: ['entreprise']});
        return programmes;
      } catch (error) {
        this.logger.error(`Erreur lors de la recuperation des programmes !: ${error.message}`);
        throw new Error('Erreur lors de la recuperation des programmes !');
      }
  }

  async getRecompenses(): Promise<Recompense[]> {
    try {
      const recompenses = await this.recompenseModel.find({where:{ statut: 'actif'}, relations: ['entreprise'] });
      return recompenses;
    } catch (error) {
      console.error(error);
      this.logger.error(`Erreur lors de la recuperation des recompenses !: ${error.message}`);
      throw new Error('Erreur lors de la recuperation des recompenses !');
    }
}

  async getEntreprises(): Promise<Entreprise[]> {
    try {
      const entreprises = await this.entrepriseModel.find({});
      return entreprises;
    } catch (error) {
      this.logger.error(`Erreur lors de la recuperation des entreprises !: ${error.message}`);
      throw new Error('Erreur lors de la recuperation des entreprises !');
    }
}

async getPoints(clientId: number): Promise<PointParEntreprise[]> {
  try {
    const client = await this.particulierModel.findOne({ where: { id: clientId } });
    if (!client) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Particulier non trouvé !',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const points = await this.pointModel.find({ where: { client: client }, relations: ['entreprise'] });
    return points;
  } catch (error) {
    this.logger.error(`Erreur lors de la récupération du solde de points : ${error.message}`);
    throw new Error('Erreur lors de la récupération du solde de points !');
    }
  }

  async getHistoriques(clientId: number): Promise<Historique[]> {
    try {
      const client = await this.particulierModel.findOne({ where: { id: clientId } });
      if (!client) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Particulier non trouvé !',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      const historiques = await this.historiqueModel.find({ where: { client: client }, relations: ['entreprise'] });
      return historiques;
    } catch (error) {
      console.error(error);
      this.logger.error(`Erreur lors de la récupération de l'historique : ${error.message}`);
      throw new Error("Erreur lors de la récupération de l'historique !");
      }
    }

    @Cron(CronExpression.EVERY_10_MINUTES)
    async updateStatusOfRecompense(){
      const existRecompenses = await this.recompensePartModel.find({});
      const currentDate = new Date().toISOString().slice(0,10);
      console.log('currentDate', currentDate);
      if(existRecompenses){
        for(let recompense of existRecompenses){
          const recompenseDateExp = new Date(recompense.dateExp).toISOString().slice(0,10);
          if (recompenseDateExp < currentDate) {
            recompense.isExpired = true;
          }else {
            recompense.isExpired = false;
          }
          await this.recompensePartModel.save(existRecompenses);
        }
      }else {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: 'Récompenses introuvables',
        }, HttpStatus.NOT_FOUND);
      }
    }



    async convertPoints(clientId: number,  idRecompense: number):  Promise<{ message: string, recompense: RecompensePart }>{
      const particulier = await this.particulierModel.findOne({
        where: { id: clientId },
      });
      if (!particulier) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: "Particulier non trouvé !",
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const newRecompense = new RecompensePart();
  
      const recompense = await this.recompenseModel.findOne({
        where: { id: idRecompense, statut: 'actif' }, relations: ['entreprise']
      });
      if (!recompense) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: "Aucun récompense en cours, vérifiez vos récompenses !",
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const entreprise = recompense.entreprise;
      if (!entreprise) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: "Entreprise associée à la récompense introuvable !",
          },
          HttpStatus.NOT_FOUND,
        );
      }
      const pointParticulier = await this.pointModel.findOne({ where: { client: particulier, entreprise: entreprise }, relations: ['entreprise'] });
      if( recompense.valeurEnPoints > pointParticulier.nombrePoints || pointParticulier.nombrePoints == 0){
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            error: "Votre solde de points est insuffisant !",
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }else{
        const mycodeRecompense = this.generateCodeRecompense();
        console.log('code recompense', mycodeRecompense);
        pointParticulier.nombrePoints -= recompense.valeurEnPoints;
        await this.pointModel.save(pointParticulier);
        newRecompense.nomRecompense = recompense.nomRecompense; 
        newRecompense.nombrePoints = recompense.valeurEnPoints;
        newRecompense.montant = recompense.montant;
        newRecompense.codeRecompense = 'GIFT' + mycodeRecompense;
        newRecompense.isExpired = false;
        const currentDate = new Date();
        const expirationDate = new Date(currentDate);
        expirationDate.setDate(currentDate.getDate() + recompense.dureeValidite);
        newRecompense.dateExp = expirationDate;
        newRecompense.client = particulier;
        newRecompense.entreprise = entreprise;

        await this.recompensePartModel.save(newRecompense);
        await this.sendingNotificationService.sendingNotificationOneUser(
          "Gain de recompense",
          "Félicitations " + particulier.prenom + " " + particulier.nom + " !" + " \n Vous avez gagné 1 "+ recompense.nomRecompense + " chez "+entreprise.nomEntreprise +
          ". Il est valide pendant " + recompense.dureeValidite + "jours"
          ,
          particulier.deviceId
        );
        return {
          message:
            "Conversion Réussie, vous avez converti " + recompense.valeurEnPoints + " point(s) de fidélité" + " votre code recompense est :" + newRecompense.codeRecompense,
            recompense: newRecompense
        };
      }


    }

    async getMesRecompenses(clientId: number): Promise<RecompensePart[]> {
      try {
        const client = await this.particulierModel.findOne({ where: { id: clientId }, relations: ['entreprise'] });
        if (!client) {
          throw new HttpException(
            {
              status: HttpStatus.NOT_FOUND,
              error: 'Particulier non trouvé !',
            },
            HttpStatus.NOT_FOUND,
          );
        }
        const mesRecompenses = await this.recompensePartModel.find({ where: { client: client, isExpired: false } });
        return mesRecompenses;
      } catch (error) {
        this.logger.error(`Erreur lors de la récupération de vos recompenses : ${error.message}`);
        throw new Error("Erreur lors de la récupération de vis recompenses !");
        }
      }

      generateCodeRecompense(): string{
        const codeRecompense = Math.floor(100000 + Math.random() * 900000).toString();
        return codeRecompense;
      }
}
