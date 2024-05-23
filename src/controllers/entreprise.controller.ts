import { Body, Controller, UseGuards, Request, Post, Put, Param, Delete, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Caissier } from 'src/entities/Caissier.entity';
import { Program } from 'src/entities/Program.entity';
import { Recompense } from 'src/entities/Recompense.entity';
import { CompanyGuard } from 'src/guards/company.guard';
import { EntrepriseService } from 'src/services/entreprise.service';

@Controller('api/v1')
@UseGuards(CompanyGuard)
@ApiBearerAuth() 
@ApiTags('Entreprises services')
export class EntrepriseController {
    constructor(private readonly entrepriseService: EntrepriseService){}

  @Post('company/program/add')
    @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nomProgram: { type: 'string', nullable: false },
        systemePoint: { type: 'enum', enum: ['palier achat', 'palier seuil'] },
        montantAttribution: { type: 'integer', nullable:true },
        nombrePointsAttribution: { type: 'integer', nullable:true },
        montantRedemption: { type: 'integer', nullable:true },
        nombrePointsRedemption: { type: 'integer', nullable:true },
      },
      description: 'Données pour créer un programme',
    },
  })
    async createProgram(
    @Body() programData: Program,@Request() request: { user: { userId: number } }): Promise<any> {
    const userId = request['user'].userId;
    return this.entrepriseService.createProgramme(programData, userId);
  }

  @Post('company/recompense/add')
    @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nomRecompense: { type: 'string', nullable: false },
        valeurEnPoints: { type: 'integer', nullable: false },
        montant: { type: 'integer', nullable:false },
        dureeValidite: { type: 'integer', nullable:false },
      },
      description: 'Données pour créer une récompense !',
    },
  })
    async createRecompense(@Body() recompenseData: Recompense, @Request() request: { user: { userId: number } }): Promise<any> {
    const userId = request['user'].userId;
    return this.entrepriseService.createRecompense(userId, recompenseData);
  }

  @Post('company/agent/add')
    @ApiBody({
    schema: {
      type: 'object',
      properties: {
        prenom: { type: 'string', nullable: false },
        nom: { type: 'string', nullable: false },
        email: { type: 'string', nullable: true },
        telephone: { type: 'string', nullable: false },
        adresse: { type: 'string', nullable: true },
        password: { type: 'string', nullable: false },
        new_password: { type: 'string',  nullable: false }
      },
      description: 'Données pour créer un programme',
    },
  })
    async createAgent(
    @Body() caissier: Caissier,@Request() request: { user: { userId: number } }): Promise<any> {
    const userId = request['user'].userId;
    return this.entrepriseService.createAgent(caissier, userId);
  }

  @Get('company/program/activate/:id')
  @ApiParam({ name: 'id', description: 'ID du programme à activer' })
  async activateProgram(@Param('id') id: number): Promise<any> {
    return this.entrepriseService.activateProgramme(id);
  }


  @Get('company/program/desactivate/:id')
  @ApiParam({ name: 'id', description: 'ID du programme à désactiver' })
  async desactivateProgram(@Param('id') id: number): Promise<any> {
    return this.entrepriseService.desactivateProgramme(id);
  }

  @Get('company/recompense/activate/:id')
  @ApiParam({ name: 'id', description: 'ID de la récompense à activer' })
  async activateRecompense(@Param('id') id: number): Promise<any> {
    return this.entrepriseService.activateRecompense(id);
  }


  @Get('company/recompense/desactivate/:id')
  @ApiParam({ name: 'id', description: 'ID de la récompense à désactiver' })
  async desactivateRecompense(@Param('id') id: number): Promise<any> {
    return this.entrepriseService.desactivateRecompense(id);
  }

  @Delete('company/program/delete/:id')
  @ApiParam({ name: 'id', description: 'ID du programme à supprimer' })
  async deleteProgram(@Param('id') id: number): Promise<any> {
    return this.entrepriseService.deleteProgramme(id);
  }

   @Get('company/programs')
   @ApiQuery({ name: 'page', description: 'Numéro de page', required: false })
   @ApiQuery({
    name: 'limit',
    description: "Limite d'éléments par page",
    required: false,
  })
  async getPrograms(@Request() request: { user: { userId: number } }): Promise<Program[]> {
    const userId = request['user'].userId;
    return this.entrepriseService.getProgrammes(userId);
  }

  @Get('company/agents')
  @ApiBearerAuth()
  async getCaissiers(@Request() request: { user: { userId: number } },): Promise<Caissier[]> {
    const userId = request['user'].userId;
    return this.entrepriseService.getCaissiers(userId);
  }

  @Get('company/recompenses')
   @ApiQuery({ name: 'page', description: 'Numéro de page', required: false })
   @ApiQuery({
    name: 'limit',
    description: "Limite d'éléments par page",
    required: false,
  })
  async getRecompenses(@Request() request: { user: { userId: number } }): Promise<Recompense[]> {
    const userId = request['user'].userId;
    return this.entrepriseService.getRecompenses(userId);
  }
}
