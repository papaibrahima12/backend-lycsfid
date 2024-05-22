import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import * as AWS from 'aws-sdk';
import { Bon } from 'src/entities/Bon.entity';
import { Entreprise } from 'src/entities/Entreprise.entity';
import { Particulier } from 'src/entities/Particulier.entity';
import { NotificationService } from 'src/notification/notification.service';
import {  LessThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class BonService {
    private readonly logger = new Logger(BonService.name);
    constructor(@InjectRepository(Bon) private bonModel: Repository<Bon>,
                @InjectRepository(Entreprise) private entrepriseModel: Repository<Entreprise>,
                @InjectRepository(Particulier) private particulierModel: Repository<Particulier>,
                private readonly sendingNotificationService: NotificationService

    ){}

    async createBon(bonData: Bon, userId: number, file?: Express.Multer.File): Promise<{message:string, bon:Bon}> {
        const bon = await this.bonModel.findOne({where : { codeReduction: bonData.codeReduction}});
        if(bon){
           throw new HttpException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'Ce bon existe deja',
        }, HttpStatus.UNPROCESSABLE_ENTITY)
    }
    if( bonData.dateDebut > bonData.dateFin){
        throw new HttpException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'La date de debut doit etre inferieur à la date de fin',
        }, HttpStatus.UNPROCESSABLE_ENTITY)
    }
    if (file) {
      const uploadedImage = await this.upload(file);
      bonData.image = uploadedImage;
      const entreprise = await this.entrepriseModel.findOne({where:{id: userId}});

          if (!entreprise) {
            throw new HttpException({
              status: HttpStatus.NOT_FOUND,
              error: 'Entreprise non trouvée',
            }, HttpStatus.NOT_FOUND);
          }
          bonData.entreprise = entreprise;
          await this.bonModel.save(bonData);

          const particuliers = await this.particulierModel.find({});
          for (let existParticulier of particuliers) {
            const currentDate = new Date();
            const ageMilliseconds = currentDate.getTime() - new Date(existParticulier.birthDate).getTime();
            const ageYears = ageMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
            const sexe = existParticulier.sexe;
            const bons = await this.bonModel.find({where: {sexeCible: sexe, isActive: true }});
            
            if ( bons.length > 0 ){
              const filteredBons = bons.filter(bon => {
              const ageMatch = ageYears >= bon.ageCibleMin && ageYears <= bon.ageCibleMax;
              return ageMatch;
                });
            if (filteredBons.length > 0) {
              await this.sendingNotificationService.sendingNotificationOneUser(
                "Promotions spéciales",
                "Vous venez de gagner de nouveaux bons de réductions !",
                existParticulier.deviceId,
              );
            } 
          }
        }
        return {message : "Bon crée avec succès", bon:bonData};
    }else{
        throw new HttpException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'Vous devez charger une image',
        }, HttpStatus.UNPROCESSABLE_ENTITY)
    }
  }

 async updateBon(id: number, bonData: Bon, file?: Express.Multer.File): Promise<{ message: string; bon: Bon }> {
  const existingBon = await this.bonModel.findOne({ where: { id: id } });

  if (!existingBon) {
    throw new HttpException({
      status: HttpStatus.NOT_FOUND,
      error: 'Bon introuvable',
    }, HttpStatus.NOT_FOUND);
  }

  if (file) {
    const uploadedImage = await this.upload(file);
    existingBon.image = uploadedImage;
  }

  Object.assign(existingBon, bonData);

  await this.bonModel.update(id,existingBon);

  return { message: 'Bon modifié avec succès !', bon: existingBon };
}

async deleteBon(id: number): Promise<{ message: string }> {
  const existingBon = await this.bonModel.findOne({where:{id:id}});

  if (!existingBon) {
    throw new HttpException({
      status: HttpStatus.NOT_FOUND,
      error: 'Bon introuvable',
    }, HttpStatus.NOT_FOUND);
  }

  await this.bonModel.remove(existingBon);
  return { message: 'Bon supprimé avec succès !' };
}

@Cron(CronExpression.EVERY_10_MINUTES)
  async updateStatusBon(){
    const existBons = await this.bonModel.find({});
    const currentDate = new Date().toISOString().slice(0,10);
    console.log('currentDate', currentDate);
    if(existBons){
      for(let bon of existBons){
        const bonDateFin = new Date(bon.dateFin).toISOString().slice(0,10);
        if (bonDateFin < currentDate) {
          bon.status = 'cloturé';
          bon.isActive = false;
        }else {
          bon.status = 'non-consommé';
          bon.isActive = true;
        }
        await this.bonModel.save(existBons);
      }
    }else {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'Bons introuvables',
      }, HttpStatus.NOT_FOUND);
    }
  }


  async upload(file): Promise<string> {
    const { originalname } = file;
    const bucketS3 = 'lycsalliofiles';
    return this.uploadS3(file.buffer, bucketS3, originalname);
}

  async uploadS3(file,bucket, name): Promise<string> {
      const s3 = this.getS3();
      const params = {
          Bucket: bucket,
          Key: String(name),
          acl: 'private',
          Body: file,
      };
      console.log(params);
      return new Promise((resolve, reject) => {
          s3.upload(params, (err, data) => {
          if (err) {
              Logger.error(err);
              reject(err.message);
          }
          resolve(data.Location);
          });
      });
  }

  getS3() {
      return new AWS.S3({
          accessKeyId: process.env.accessKEY,
          secretAccessKey: process.env.secretAccessKey,
      });
  }

     async getBons(userId:number): Promise<Bon[]> {
      try {
        const entreprise = await this.entrepriseModel.findOne({where:{id: userId}});
        if (!entreprise) {
          throw new HttpException({
            status: HttpStatus.NOT_FOUND,
            error: 'Entreprise non trouvée',
          }, HttpStatus.NOT_FOUND);
        } 
        const bons = await this.bonModel.find({where:{entreprise:entreprise}});
        const currentDate = new Date();
        const expiredBons = await this.bonModel.find({
          where: { dateFin: LessThanOrEqual(currentDate), entreprise:entreprise },
        });
        console.log('bons expirés: ',expiredBons);
        for (var bon of expiredBons) {
          bon.isActive = false;
          bon.status = 'cloturé';
          await this.bonModel.save(bon);
        }
        return bons;
      } catch (error) {
        this.logger.error(`Erreur lors de la recuperation des bons: ${error.message}`);
        throw new Error('Erreur lors de la recuperation des bons');
      }
  }

  async activateBon(id:number, userId:number): Promise<{message:string}>{
    try {
        const entreprise = await this.entrepriseModel.findOne({where:{id: userId}});
        const bon = await this.bonModel.findOne({where:{id: id, entreprise:entreprise}});
        bon.isActive = true;
        bon.status = 'consommé';
        await this.bonModel.save(bon);
        return {message: "Bon activé avec succès"};
      } catch (error) {
        this.logger.error(`Erreur lors de la recuperation des bons: ${error.message}`);
        throw new Error('Erreur lors de la recuperation des bons');
      }
  }
}
