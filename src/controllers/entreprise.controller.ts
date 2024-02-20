import { Body, Controller, UseGuards, Request, Post, Put, Param, Delete, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Program } from 'src/entities/Program.entity';
import { CompanyGuard } from 'src/guards/company.guard';
import { EntrepriseService } from 'src/services/entreprise.service';

@Controller('api/v1')
@UseGuards(CompanyGuard)
@ApiBearerAuth() 
@ApiTags('entreprises services')
export class EntrepriseController {
    constructor(private readonly entrepriseService: EntrepriseService){}

  //   @Post('company/mecanisme/add')
  //   @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       nombrePoints: { type: 'number', nullable: false },
  //       montant: { type: 'number', nullable:false },
  //       type: { type: 'enum', enum: ['attribution', 'redemption'] },
  //     },
  //     description: 'Données pour créer un mecanisme',
  //   },
  // })
  //   async createMecanisme(
  //   @Body() mecanismeData: Mecanisme,@Request() request: { user: { userId: number } }): Promise<any> {
  //   const userId = request['user'].userId;
  //   return this.entrepriseService.createMecanisme(mecanismeData, userId);
  // }

  // @Put('company/mecanisme/update/:id')
  // @ApiBody({ type: Mecanisme, description: 'Données pour mettre à jour un mecanisme' })
  // @ApiParam({ name: 'id', description: 'ID du mecanisme à mettre à jour' })
  // async updateMecanisme(@Param('id') id: number,@Body() mecanismeData: any): Promise<any> {
  //   return this.entrepriseService.updateMecanisme(id, mecanismeData);
  // }

  // @Delete('company/mecanisme/delete/:id')
  // @ApiParam({ name: 'id', description: 'ID du mecanisme à supprimer' })
  // async deleteMecanisme(@Param('id') id: number): Promise<any> {
  //   return this.entrepriseService.deleteMecanisme(id);
  // }

  //  @Get('company/mecanismes')
  //  @ApiQuery({ name: 'page', description: 'Numéro de page', required: false })
  //  @ApiQuery({
  //   name: 'limit',
  //   description: "Limite d'éléments par page",
  //   required: false,
  // })
  // async getBons(@Request() request: { user: { userId: number } }): Promise<Mecanisme[]> {
  //   const userId = request['user'].userId;
  //   return this.entrepriseService.getMecanismes(userId);
  // }


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

  @Get('company/program/activate/:id')
  @ApiParam({ name: 'id', description: 'ID du programme à activer' })
  async activateProgram(@Param('id') id: number): Promise<any> {
    return this.entrepriseService.activateProgramme(id);
  }

  @Post('company/program/attribute')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        clientId: { type: 'integer', nullable:false },
        montant: { type: 'integer', nullable:false },
      },
      description: 'Données pour attribuer des points !',
    },
  })  async attributePoints(@Body() infos:{clientId:number, montant:number} ,@Request() request: { user: { userId: number }}): Promise<any> {
    const userId = request['user'].userId;
    return this.entrepriseService.attributePoints(userId, infos.clientId, infos.montant);
  }

  @Get('company/program/desactivate/:id')
  @ApiParam({ name: 'id', description: 'ID du programme à désactiver' })
  async desactivateProgram(@Param('id') id: number): Promise<any> {
    return this.entrepriseService.desactivateProgramme(id);
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
}
