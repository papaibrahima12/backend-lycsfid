import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bon } from 'src/entities/Bon.entity';
import { Campagne } from 'src/entities/Campagne.entity';
import { Entreprise } from 'src/entities/Entreprise.entity';
import { Historique } from 'src/entities/Historique.entity';
import { Particulier } from 'src/entities/Particulier.entity';
import { PointParEntreprise } from 'src/entities/PointParEntreprise.entity';
import { Program } from 'src/entities/Program.entity';
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
                    
                    const bons = await this.bonModel.find({ where: { isActive: true, sexeCible: sexe } });
                
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
        
        const campagnes = await this.campagneModel.find({ where: { isActive: true, status: 'en cours', sexeCible: sexe } });
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
        const programmes = await this.programModel.find({where:{isActive:true}});
        return programmes;
      } catch (error) {
        this.logger.error(`Erreur lors de la recuperation des programmes !: ${error.message}`);
        throw new Error('Erreur lors de la recuperation des programmes !');
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
  console.log('clientNumber: ' + clientId);
  try {
    const client = await this.particulierModel.findOne({ where: { id: clientId } });
    console.log('client',client);
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
    console.log('les points',points)
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
      const historiques = await this.historiqueModel.find({ where: { client: client } });
      return historiques;
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération de l'historique : ${error.message}`);
      throw new Error("Erreur lors de la récupération de l'historique !");
      }
    }
}
