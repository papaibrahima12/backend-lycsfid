import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campagne } from 'src/entities/Campagne.entity';
import { Entreprise } from 'src/entities/Entreprise.entity';


@Injectable()
export class CampagneService {
    private readonly logger = new Logger(CampagneService.name);
    constructor(@InjectRepository(Campagne) private campagneModel: Repository<Campagne>,
        @InjectRepository(Entreprise) private entrepriseModel: Repository<Entreprise>
    ){}

    async createCampagne(campagneData: Campagne,userId: number, file?: Express.Multer.File,): Promise<{message:string, campagne:Campagne}> {
        const bon = await this.campagneModel.findOne({where : { codePromo: campagneData.codePromo, entreprise:{id:userId} }});
        if(bon){
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
      await this.campagneModel.save(campagneData);
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
    Object.assign(existingCampagne, campagneData);

    const majCampagne = await this.campagneModel.save(existingCampagne);
    return { message: 'Campagne modifié avec succès !', campagne : majCampagne}
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
      return campagnes;
    } catch (error) {
      this.logger.error(`An error occurred while retrieving campagnes: ${error.message}`);
      throw new Error('An error occurred while retrieving campagnes');
    }
  }
}
