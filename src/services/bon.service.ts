import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as AWS from 'aws-sdk';
import { Bon } from 'src/entities/Bon.entity';
import { Entreprise } from 'src/entities/Entreprise.entity';
import {  Repository } from 'typeorm';

@Injectable()
export class BonService {
    private readonly logger = new Logger(BonService.name);
    constructor(@InjectRepository(Bon) private bonModel: Repository<Bon>,
                @InjectRepository(Entreprise) private entrepriseModel: Repository<Entreprise>
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
    bonData.image = uploadedImage;
  }

  Object.assign(existingBon, bonData);

  const majBon = await this.bonModel.save(existingBon);

  return { message: 'Bon modifié avec succès !', bon: majBon };
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

     async getBons(): Promise<Bon[]> {
      try {
        const bons = await this.bonModel.find({});
        return bons;
      } catch (error) {
        this.logger.error(`An error occurred while retrieving bons: ${error.message}`);
        throw new Error('An error occurred while retrieving bons');
      }
  }
}
