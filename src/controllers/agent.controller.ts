import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
    Request,
    Param,
  } from '@nestjs/common';
import { AgentService } from 'src/services/agent.service';
import {
  ApiTags,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AgentGuard } from 'src/guards/agent.guard';
import { Historique } from 'src/entities/Historique.entity';


@ApiTags('Agents Services')
@UseGuards(AgentGuard)
@ApiBearerAuth() 
@Controller('api/v1')
export class AgentController { 
    constructor(
        private readonly agentService: AgentService,
      ) {}

  @Post('agent/points/attribute')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        clientId: { type: 'integer', nullable:false },
        entrepriseId: { type: 'integer', nullable:false },
        montant: { type: 'integer', nullable:false },
      },
      description: 'Données pour attribuer des points !',
    },
  })  async attributePoints(@Body() infos:{clientId:number, entrepriseId: number, montant:number} ,@Request() request: { userId: { sub: number }}): Promise<any> {
    const caissierId = request['userId'].sub;
    return this.agentService.attributePoints(caissierId, infos.entrepriseId, infos.clientId, infos.montant);
  }

  @Post('agent/points/withdraw')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        clientId: { type: 'integer', nullable:false },
        entrepriseId: { type: 'integer', nullable:false },
        montant: { type: 'integer', nullable:false },
      },
      description: 'Données pour convertir des points !',
    },
  })  async enleverPoints(@Body() infos:{clientId:number, entrepriseId: number, montant:number} ,@Request() request: { userId: { sub: number }}): Promise<any> {
    const caissierId = request['userId'].sub;
    return this.agentService.enleverPoint(caissierId, infos.entrepriseId, infos.clientId, infos.montant);
  }

  @Get('agent/cancel/transaction/:id')
  @ApiParam({ name: 'id', description: 'ID Transaction' })
  async cancelTransaction(@Param('id') id: number,@Request() request: { userId: { sub: number }}): Promise<any> {
    const caissierId = request['userId'].sub;
    return this.agentService.annulerTransaction(caissierId, id);
  }

  @Get('caissier/historiques')
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', description: 'Numéro de page', required: false })
  @ApiQuery({
    name: 'limit',
    description: "Limite d'éléments par page",
    required: false,
  })
  async getHistoriques(@Request() request: { userId: { sub: number }}): Promise<Historique[]> {
    const caissierId = request['userId'].sub;
    return this.agentService.getHistoriques(caissierId);
  }
}