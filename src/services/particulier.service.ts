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
      
     async getBons(): Promise<Bon[]> {
      try {
        const bons = await this.bonModel.find({where:{ isActive: true }});
        return bons;
      } catch (error) {
        this.logger.error(`Erreur lors de la recuperation des bons !: ${error.message}`);
        throw new Error('Erreur lors de la recuperation des bons !');
      }
  }

  async getCampagnes(): Promise<Campagne[]> {
      try {
        const campagnes = await this.campagneModel.find({where:{status:'en cours'}});
        return campagnes;
      } catch (error) {
        this.logger.error(`Erreur lors de la recuperation des campagnes !: ${error.message}`);
        throw new Error('Erreur lors de la recuperation des campagnes !');
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
    const points = await this.pointModel.find({ where: { client }, relations: ['entreprise'] });
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
      const historiques = await this.historiqueModel.find({ where: { client } });
      return historiques;
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération de l'historique : ${error.message}`);
      throw new Error("Erreur lors de la récupération de l'historique !");
      }
    }
}
