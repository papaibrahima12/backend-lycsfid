import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Campagne } from 'src/entities/Campagne.entity';
import { Entreprise } from 'src/entities/Entreprise.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Bon } from 'src/entities/Bon.entity';
import { Particulier } from 'src/entities/Particulier.entity';
import { NotificationService } from 'src/notification/notification.service';
import { StatsCamp } from 'src/entities/StatsCamp.entity';


@Injectable()
export class CampagneService {
    private generatedCodes = new Set();
    private readonly logger = new Logger(CampagneService.name);
    constructor(@InjectRepository(Campagne) private campagneModel: Repository<Campagne>,
                @InjectRepository(Entreprise) private entrepriseModel: Repository<Entreprise>,
                @InjectRepository(Particulier) private particulierModel: Repository<Particulier>,
                @InjectRepository(StatsCamp) private statCampRepository: Repository<StatsCamp>,
                private readonly sendingNotificationService: NotificationService
                
    ){}

    async createCampagne(campagneData: Campagne,userId: number, file?: Express.Multer.File,): Promise<{message:string, campagne:Campagne}> {
      let nbreCampagnes = 0;
        const codePromo = this.generateCodePromo();
        campagneData.codePromo = codePromo;
        const campagne = await this.campagneModel.findOne({where : { nomCampagne: campagneData.nomCampagne, entreprise:{id:userId} }});
        if(campagne){
           throw new HttpException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'Cette campagne existe déjà',
        }, HttpStatus.UNPROCESSABLE_ENTITY)
    }
    if( campagneData.dateDebut > campagneData.dateFin){
        throw new HttpException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'La date de début doit etre inférieure à la date de fin',
        }, HttpStatus.UNPROCESSABLE_ENTITY)
    }
    if (file) {
      const uploadedImage = await this.upload(file);
      campagneData.image = uploadedImage;
    const entreprise = await this.entrepriseModel.findOne({where:{id: userId}});

    if (!entreprise) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'Entreprise non trouvée',
      }, HttpStatus.NOT_FOUND);
    }  
    campagneData.entreprise = entreprise;
    campagneData.codePromo = this.generateCodePromo();
      await this.campagneModel.save(campagneData);
      nbreCampagnes = nbreCampagnes + 1;
      await this.statCampRepository.save({
        nombreCampagnes: nbreCampagnes,
        dateCreation: new Date(),
        entreprise: entreprise
      });
      const particuliers = await this.particulierModel.find({});
      for (let existParticulier of particuliers) {
        const currentDate = new Date();
        const ageMilliseconds = currentDate.getTime() - new Date(existParticulier.birthDate).getTime();
        const ageYears = ageMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
        const sexe = existParticulier.sexe;
        const campagnes = await this.campagneModel.find({where: {sexeCible: sexe, status: 'en cours', isActive: true }});
        
        if ( campagnes.length > 0 ){
          const filteredCampagnes = campagnes.filter(campagne => {
          const ageMatch = ageYears >= campagne.ageCibleMin && ageYears <= campagne.ageCibleMax;
          return ageMatch;
            });
        if (filteredCampagnes.length > 0) {
          await this.sendingNotificationService.sendingNotificationOneUser(
            "Promotions spéciales",
            "De nouvelles promotions sont disponibles !",
            existParticulier.deviceId,
          );
          } 
        }
      }
      return {message : "Campagne crée avec succès", campagne:campagneData};
    }else{
        throw new HttpException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'Vous devez charger une image',
        }, HttpStatus.UNPROCESSABLE_ENTITY)
    }
  }

  async startCampagne(id: number): Promise<{ message: string }> {
        const existingCampagne = await this.campagneModel.findOne({where:{id:id}});
        if (!existingCampagne) {
            throw new HttpException({
            status: HttpStatus.NOT_FOUND,
            error: 'Campagne introuvable',
            }, HttpStatus.NOT_FOUND);
        }
        existingCampagne.isActive = true;
        existingCampagne.status = 'en cours'
        await this.campagneModel.save(existingCampagne);
        return { message: 'Campagne activée avec succès !' };
    }

  async updateCampagne(id: number, campagneData: Campagne, file?: Express.Multer.File): Promise<{message:string,campagne:Campagne}> {
    const existingCampagne = await this.campagneModel.findOne({where:{id:id}});

    if (!existingCampagne) {
      throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: 'Campagne introuvable',
        }, HttpStatus.NOT_FOUND)
    }

    if (file) {
      const uploadedImage = await this.upload(file);
      campagneData.image = uploadedImage;
    }

    if( campagneData.dateDebut > campagneData.dateFin){
      throw new HttpException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        error: 'La date de début doit etre inférieure à la date de fin',
      }, HttpStatus.UNPROCESSABLE_ENTITY)
  }
    Object.assign(existingCampagne, campagneData);

    await this.campagneModel.update(id, existingCampagne);
    return { message: 'Campagne modifiée avec succès !', campagne : existingCampagne}
  }

  async deleteCampagne(id: number): Promise<{message:string}> {
    const existingCampagne = await this.campagneModel.findOne({where: {id: id}});

    if (!existingCampagne) {
            throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: 'Campagne introuvable',
        }, HttpStatus.NOT_FOUND)
    }

    await this.campagneModel.remove(existingCampagne);
    return {message: 'Campagne supprimée avec succès !'}
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async updateStatusCampagne(){
    const existCampagnes = await this.campagneModel.find({});
    const currentDate = new Date().toISOString().slice(0,10);
    if(existCampagnes){
      for(let campagne of existCampagnes){
        const campagneDateFin = new Date(campagne.dateFin).toISOString().slice(0,10);
        
        if (campagneDateFin < currentDate) {
          campagne.status = 'cloturé';
          campagne.isActive = false;
        }else {
          campagne.status = 'en cours';
          campagne.isActive = true;
        }
        await this.campagneModel.save(existCampagnes);
        
      }
    }else {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'Campagnes introuvables',
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

     async getCampagnes(userId:number): Promise<Campagne[]> {
    try {
      const entreprise = await this.entrepriseModel.findOne({where:{id: userId}});
         if (!entreprise) {
            throw new HttpException({
              status: HttpStatus.NOT_FOUND,
              error: 'Entreprise non trouvée',
            }, HttpStatus.NOT_FOUND);
          }
      const campagnes = await this.campagneModel.find({where:{entreprise:entreprise}});
      const currentDate = new Date();
      const expiredCampagnes = await this.campagneModel.find({
        where: { dateFin : LessThanOrEqual(currentDate), entreprise:entreprise },
      });
      for (var campagne of expiredCampagnes) {
        campagne.isActive = false;
        campagne.status = 'cloturé';
        await this.campagneModel.save(campagne);
      }
      return campagnes;
    } catch (error) {
      this.logger.error(`An error occurred while retrieving campagnes: ${error.message}`);
      throw new Error('An error occurred while retrieving campagnes');
    }
  }

  generateCodePromo(): string{
    let codePromo: string;
    do {
      codePromo = Math.floor(100000 + Math.random() * 900000).toString();
    } while (this.generatedCodes.has(codePromo));
    this.generatedCodes.add(codePromo);
    return codePromo;
  }
}
