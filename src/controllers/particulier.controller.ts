import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Bon } from 'src/entities/Bon.entity';
import { Campagne } from 'src/entities/Campagne.entity';
import { Program } from 'src/entities/Program.entity';
import { ParticulierGuard } from 'src/guards/particulier.guard';
import { ParticulierService } from 'src/services/particulier.service';


@Controller('api/v1')
@ApiTags('Particuliers')
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
  async getBons(): Promise<Bon[]> {
    return this.particulierService.getBons();
  }

  @Get('particulier/campagnes/all')
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', description: 'Numéro de page', required: false })
  @ApiQuery({
    name: 'limit',
    description: "Limite d'éléments par page",
    required: false,
  })
  async getCampagnes(): Promise<Campagne[]> {
    return this.particulierService.getCampagnes();
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





}
