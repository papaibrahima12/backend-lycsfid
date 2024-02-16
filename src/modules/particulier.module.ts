import { Program } from 'src/entities/Program.entity';
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticulierController } from 'src/controllers/particulier.controller';
import { Bon } from 'src/entities/Bon.entity';
import { Campagne } from 'src/entities/Campagne.entity';
import { Entreprise } from 'src/entities/Entreprise.entity';
import { Particulier } from 'src/entities/Particulier.entity';
import { ParticulierService } from 'src/services/particulier.service';

@Module({
    imports: [
    TypeOrmModule.forFeature([Entreprise, Particulier, Bon, Program, Campagne]),
  ],
  controllers: [ParticulierController],
  providers: [ParticulierService, JwtService],
})
export class ParticulierModule {}
