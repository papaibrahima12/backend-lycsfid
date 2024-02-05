import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntrepriseController } from 'src/controllers/entreprise.controller';
import { Bon } from 'src/entities/Bon.entity';
import { Campagne } from 'src/entities/Campagne.entity';
import { Entreprise } from 'src/entities/Entreprise.entity';
import { Particulier } from 'src/entities/Particulier.entity';
import { EntrepriseService } from 'src/services/entreprise.service';

@Module({
     imports: [
    TypeOrmModule.forFeature([Entreprise,Particulier,Bon,Campagne]),
  ],
  controllers: [EntrepriseController],
  providers: [EntrepriseService, JwtService],
})
export class EntrepriseModule {}
