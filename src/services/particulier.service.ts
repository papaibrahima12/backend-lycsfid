import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bon } from 'src/entities/Bon.entity';
import { Entreprise } from 'src/entities/Entreprise.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ParticulierService {
     private readonly logger = new Logger(ParticulierService.name);
    constructor(@InjectRepository(Bon) private bonModel: Repository<Bon>,
                @InjectRepository(Entreprise) private entrepriseModel: Repository<Entreprise>
    ){}

     async getBons(): Promise<Bon[]> {
      try {
        const bons = await this.bonModel.find({where:{isActive: true}});
        return bons;
      } catch (error) {
        this.logger.error(`Erreur lors de la recuperation des bons !: ${error.message}`);
        throw new Error('Erreur lors de la recuperation des bons !');
      }
  }

}
