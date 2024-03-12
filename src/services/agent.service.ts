import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Caissier } from 'src/entities/Caissier.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PointParEntreprise } from 'src/entities/PointParEntreprise.entity';
import { Entreprise } from 'src/entities/Entreprise.entity';
import { Particulier } from 'src/entities/Particulier.entity';
import { Program } from 'src/entities/Program.entity';
import { Historique } from 'src/entities/Historique.entity';

@Injectable()
export class AgentService {
    constructor(
        @InjectRepository(PointParEntreprise) private pointModel: Repository<PointParEntreprise>,
        @InjectRepository(Entreprise) private entrepriseModel: Repository<Entreprise>,
        @InjectRepository(Particulier) private particulierModel: Repository<Particulier>,
        @InjectRepository(Caissier) private caissierModel: Repository<Caissier>,
        @InjectRepository(Historique) private historiqueModel: Repository<Historique>,
        @InjectRepository(Program) private programModel: Repository<Program>){}

    async attributePoints(caissierId: number, entrepriseId:number, clientId: number, montant: number): Promise<{ message: string }>{
      const entreprise = await this.entrepriseModel.findOne({ where: { id: entrepriseId } });
      const caissier = await this.caissierModel.findOne({ where: { id: caissierId, entreprise: entreprise } });
      if (!caissier) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Agent introuvable !',
          },
          HttpStatus.NOT_FOUND,
        );
      }
  
      // const client = await this.particulierModel.findOne({where: {id: clientId}})   
  
      const particulier = await this.particulierModel.findOne({where: {id: clientId}});
      if(!particulier){
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Particulier non trouvé !',
          },
          HttpStatus.NOT_FOUND,
        );
      }
  
      const programme = await this.programModel.findOne({where:{entreprise: entreprise , isActive:true}});
      if(!programme){
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Aucun programme en cours, verifiez vos programmes !',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      var equiPoint = 0;
      if(programme.systemePoint == 'palier achat'){
        if(montant < programme.montantAttribution){
          equiPoint = 0;
        }else{
          equiPoint = Math.floor(montant / programme.montantAttribution);
          console.log('points',Math.floor(equiPoint));
        }
        
      }else if(programme.systemePoint == 'seuil achat'){
        if(montant < programme.montantAttribution){
          equiPoint = 0;
        }else{
          equiPoint = programme.nombrePointsAttribution;
        }
      }

      var today = new Date();
      var DD = today.getDate();
      var MM = today.getMonth();
      var YYYY = today.getFullYear();
      var hh = today.getHours();
      var mm = today.getMinutes();
      var ss = today.getSeconds();
      var todayDateTime = new Date(YYYY, MM, DD, hh, mm, ss)
  
      const clientPoints = await this.pointModel.findOne({where:{entreprise: entreprise, client: particulier}})
      console.log('Client verif', clientPoints);
      if(!clientPoints){
        const newClientPoint = new PointParEntreprise(); 
          newClientPoint.nombrePoints = equiPoint;
          newClientPoint.client = particulier;
         newClientPoint.entreprise = entreprise;

        await this.pointModel.save(newClientPoint);
        particulier.soldePoints = [newClientPoint];
        const historique = await this.historiqueModel.create({
          nombrePoints: newClientPoint.nombrePoints,
          montant: montant,
          typeTransaction: 'attribution',
          client: newClientPoint.client,
          entreprise: newClientPoint.entreprise,
          dateTransaction: todayDateTime
        });
        await this.historiqueModel.save(historique);
      }else{
          clientPoints.nombrePoints += equiPoint;
          clientPoints.client = particulier;
      
          await this.pointModel.save(clientPoints);

          const updatedClientPoint = await this.pointModel.findOne({
            where: { id: clientPoints.id },
            relations: ['client', 'entreprise'],
          });
          particulier.soldePoints = [updatedClientPoint];
          const historique = await this.historiqueModel.create({
            nombrePoints: equiPoint,
            montant: montant,
            typeTransaction: 'attribution',
            client: updatedClientPoint.client,
            entreprise: updatedClientPoint.entreprise,
            dateTransaction: todayDateTime
          });
          await this.historiqueModel.save(historique);
          console.log('Solde Points existant',particulier.soldePoints);
      }
      return { message: 'Attribution Reussie, vous avez attribué '+equiPoint+' point(s)' };
    }

    async getParticulier(id: number): Promise<Particulier>{
        const particulier = await this.particulierModel.findOne({where:{id: id}});
        if(!particulier){
          throw new HttpException(
            {
              status: HttpStatus.NOT_FOUND,
              error: 'Aucun particulier trouvé !',
            },
            HttpStatus.NOT_FOUND,
          );
        }
        return particulier;
    }

    async enleverPoint(caissierId: number, entrepriseId:number, clientId: number, montant: number): Promise<{ message: string }>{
      const entreprise = await this.entrepriseModel.findOne({ where: { id: entrepriseId } });
      const caissier = await this.caissierModel.findOne({ where: { id: caissierId, entreprise: entreprise } });
      if (!caissier) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Agent introuvable !',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      var today = new Date();
      var DD = today.getDate();
      var MM = today.getMonth();
      var YYYY = today.getFullYear();
      var hh = today.getHours();
      var mm = today.getMinutes();
      var ss = today.getSeconds();
      var todayDateTime = new Date(YYYY, MM, DD, hh, mm, ss)
    
      const particulier = await this.particulierModel.findOne({where: {id: clientId}});
      if(!particulier){
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Particulier non trouvé !',
          },
          HttpStatus.NOT_FOUND,
        );
      }
  
      const programme = await this.programModel.findOne({where:{entreprise: entreprise , isActive:true}});
      if(!programme){
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Aucun programme en cours, verifiez vos programmes !',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      var equiPoint = 0;
        if(montant < programme.montantRedemption){
          equiPoint = 0;
        }else{
          equiPoint = Math.floor((montant * programme.nombrePointsRedemption) / programme.montantRedemption);
          console.log('points',Math.floor(equiPoint));
        }
      const pointClient = await this.pointModel.findOne({where: {entreprise: entreprise, client: particulier}});
      if(pointClient.nombrePoints < equiPoint) {
        return { message: 'Votre solde de point est insuffisant pour faire cette transaction !' };
      }
      pointClient.nombrePoints -= equiPoint;
      await this.pointModel.save(pointClient);
      const historique = await this.historiqueModel.create({
        nombrePoints: equiPoint,
        montant: montant,
        typeTransaction: 'utilisation',
        client: particulier,
        entreprise: entreprise,
        dateTransaction: todayDateTime
      });
      await this.historiqueModel.save(historique);
      particulier.soldePoints = [pointClient]; 
      return { message: 'vous avez utilisé '+equiPoint+' point(s) de votre solde' };

    }

    async annulerTransaction(caissierId:number, clientId: number){
      const particulier = await this.particulierModel.findOne({where: {id: clientId}});
      if(!particulier){
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Particulier non trouvé !',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const caissier = await this.caissierModel.findOne({ where: { id: caissierId } });
      if (!caissier) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Agent introuvable !',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const existHistorique = await this.historiqueModel.findOne({
        where: { client: particulier, typeTransaction: 'attribution', isCanceled: false },
        order: { dateTransaction: 'DESC' }
      });
      const entreprise = existHistorique.entreprise;
      console.log('Histo',existHistorique);
      if (!existHistorique) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Aucune transaction récente trouvée pour ce particulier !',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      
      const pointCorrespondant = await this.pointModel.findOne({where: {client: particulier, entreprise: entreprise}});
      console.log('test', pointCorrespondant);
      if (!pointCorrespondant) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: "Aucun solde de points trouvé pour l'entreprise associée à cette transaction !",
          },
          HttpStatus.NOT_FOUND,
        );
      }
      
      const equiPoint = existHistorique.nombrePoints;
      pointCorrespondant.nombrePoints -= equiPoint;
      
      await this.pointModel.save(pointCorrespondant);
      existHistorique.isCanceled = true;
      await this.historiqueModel.save(existHistorique);

      return { message: 'Transaction annulée avec succès !'};
    }

}
