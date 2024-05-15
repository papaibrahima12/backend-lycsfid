import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BonController } from "src/controllers/bon.controller";
import { CampagneController } from "src/controllers/campagne.controller";
import { Bon } from "src/entities/Bon.entity";
import { Campagne } from "src/entities/Campagne.entity";
import { Entreprise } from "src/entities/Entreprise.entity";
import { BonService } from "src/services/bon.service";
import { CampagneService } from "src/services/campagne.service";

@Module({
  imports: [TypeOrmModule.forFeature([Campagne, Bon, Entreprise])],
  controllers: [BonController, CampagneController],
  providers: [BonService, CampagneService, JwtService],
})
export class FileModuleModule {}
