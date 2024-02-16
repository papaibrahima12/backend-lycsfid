import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bon } from 'src/entities/Bon.entity';
import { Campagne } from 'src/entities/Campagne.entity';
import { Entreprise } from 'src/entities/Entreprise.entity';
import { Program } from 'src/entities/Program.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ParticulierService {
     private readonly logger = new Logger(ParticulierService.name);
    constructor(@InjectRepository(Bon) private bonModel: Repository<Bon>,
                @InjectRepository(Campagne) private campagneModel: Repository<Campagne>,
                @InjectRepository(Program) private programModel: Repository<Program>,
                @InjectRepository(Entreprise) private entrepriseModel: Repository<Entreprise>
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

}
