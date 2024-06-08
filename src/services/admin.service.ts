import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Entreprise } from 'src/entities/Entreprise.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Entreprise)
        private entrepriseModel: Repository<Entreprise>,
    ){}
    async changeStatusEntreprise(id: number): Promise<{ message: string }> {
        const existEntreprise = await this.entrepriseModel.findOne({where:{id:id}});
  
        if (!existEntreprise) {
            throw new HttpException({
            status: HttpStatus.NOT_FOUND,
            error: 'Entreprise introuvable',
            }, HttpStatus.NOT_FOUND);
        }
        if(existEntreprise.suspended == true) {
          existEntreprise.suspendedAt = todayDateTime;
          existEntreprise.suspended = false;
          await this.entrepriseModel.save(existEntreprise);
        }else{
          var today = new Date();
          var DD = today.getDate();
          var MM = today.getMonth();
          var YYYY = today.getFullYear();
          var hh = today.getHours();
          var mm = today.getMinutes();
          var ss = today.getSeconds();
          var todayDateTime = new Date(YYYY, MM, DD, hh, mm, ss)
          existEntreprise.suspended = true;
          existEntreprise.suspendedAt = todayDateTime;
          await this.entrepriseModel.save(existEntreprise);
        }
        return { message: 'Statut Entreprise changé avec succès !' };
      }
}
