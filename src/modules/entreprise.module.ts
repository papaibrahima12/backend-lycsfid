import { Verification } from 'src/entities/Verification.entity';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntrepriseController } from 'src/controllers/entreprise.controller';
import { Bon } from 'src/entities/Bon.entity';
import { Campagne } from 'src/entities/Campagne.entity';
import { Entreprise } from 'src/entities/Entreprise.entity';
import { Mecanisme } from 'src/entities/Mecanisme.entity';
import { Particulier } from 'src/entities/Particulier.entity';
import { PointParEntreprise } from 'src/entities/PointParEntreprise.entity';
import { Program } from 'src/entities/Program.entity';
import { EntrepriseService } from 'src/services/entreprise.service';
import { Caissier } from 'src/entities/Caissier.entity';
import { Recompense } from 'src/entities/Recompense.entity';
import { NotificationService } from 'src/notification/notification.service';

@Module({
     imports: [
    TypeOrmModule.forFeature([Entreprise,Particulier,Bon,Campagne,Mecanisme,Program, Caissier, Verification, PointParEntreprise, Recompense]),
  ],
  controllers: [EntrepriseController],
  providers: [EntrepriseService, JwtService, NotificationService],
})
export class EntrepriseModule {}
