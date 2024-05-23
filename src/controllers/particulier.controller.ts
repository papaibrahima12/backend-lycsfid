import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Bon } from 'src/entities/Bon.entity';
import { Campagne } from 'src/entities/Campagne.entity';
import { Entreprise } from 'src/entities/Entreprise.entity';
import { Historique } from 'src/entities/Historique.entity';
import { PointParEntreprise } from 'src/entities/PointParEntreprise.entity';
import { Program } from 'src/entities/Program.entity';
import { Recompense } from 'src/entities/Recompense.entity';
import { RecompensePart } from 'src/entities/RecompensePart';
import { ParticulierGuard } from 'src/guards/particulier.guard';
import { ParticulierService } from 'src/services/particulier.service';


@Controller('api/v1')
@ApiTags('Particuliers Services')
@UseGuards(ParticulierGuard)
export class ParticulierController {
      constructor(private particulierService: ParticulierService) {}

  @Get('particulier/bons/all')
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', description: 'Numéro de page', required: false })
  @ApiQuery({
    name: 'limit',
    description: "Limite d'éléments par page",
    required: false,
  })
  async getBons(@Request() request: { userId: { sub: number }}): Promise<Bon[]> {
    const userId = request['userId'].sub;
    return this.particulierService.getBons(userId);
  }

  @Get('particulier/campagnes/all')
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', description: 'Numéro de page', required: false })
  @ApiQuery({
    name: 'limit',
    description: "Limite d'éléments par page",
    required: false,
  })
  async getCampagnes(@Request() request: { userId: { sub: number }}): Promise<Campagne[]> {
    const userId = request['userId'].sub;
    return this.particulierService.getCampagnes(userId);
  }


  @Get('particulier/programs/all')
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', description: 'Numéro de page', required: false })
  @ApiQuery({
    name: 'limit',
    description: "Limite d'éléments par page",
    required: false,
  })
  async getPrograms(): Promise<Program[]> {
    const today = new Date();
    today.getDate();
    return this.particulierService.getPrograms();
  }

  @Get('particulier/recompenses/all')
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', description: 'Numéro de page', required: false })
  @ApiQuery({
    name: 'limit',
    description: "Limite d'éléments par page",
    required: false,
  })
  async getRecompenses(): Promise<Recompense[]> {
    const today = new Date();
    today.getDate();
    return this.particulierService.getRecompenses();
  }

  @Get('particulier/companies/all')
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', description: 'Numéro de page', required: false })
  @ApiQuery({
    name: 'limit',
    description: "Limite d'éléments par page",
    required: false,
  })
  async getEntreprises(): Promise<Entreprise[]> {
    return this.particulierService.getEntreprises();
  }

  @Get('particulier/points/all')
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', description: 'Numéro de page', required: false })
  @ApiQuery({
    name: 'limit',
    description: "Limite d'éléments par page",
    required: false,
  })
  async getPoints(@Request() request: { userId: { sub: number }}): Promise<PointParEntreprise[]> {
    const userId = request['userId'].sub;
    return this.particulierService.getPoints(userId);
  }
  
  @Get('particulier/historiques/all')
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', description: 'Numéro de page', required: true })
  @ApiQuery({
    name: 'limit',
    description: "Limite d'éléments par page",
    required: false,
  })
  async getHistoriques(@Request() request: { userId: { sub: number }}): Promise<Historique[]> {
    const userId = request['userId'].sub;
    return this.particulierService.getHistoriques(userId);
  }

  @Get('particulier/mes_recompenses/all')
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', description: 'Numéro de page', required: false })
  @ApiQuery({
    name: 'limit',
    description: "Limite d'éléments par page",
    required: false,
  })
  async getMesRecompenses(@Request() request: { userId: { sub: number }}): Promise<RecompensePart[]> {
    const userId = request['userId'].sub;
    return this.particulierService.getMesRecompenses(userId);
  }

  @Get('particulier/convert/recompense/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID de la récompense à échanger' })
  async activateRecompense(@Request() request: { userId: { sub: number }},  @Param('id') id: number): Promise<any> {
    const userId = request['userId'].sub;
    return this.particulierService.convertPoints(userId, id);
  }

}
