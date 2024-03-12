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
} from '@nestjs/swagger';
import { OtpService } from 'src/services/otp.service';
import { SendMessageServiceService } from 'src/services/sendmessageservice.service';
import { AgentGuard } from 'src/guards/agent.guard';
import { info } from 'console';


@ApiTags('Authentication for Agent')
@UseGuards(AgentGuard)
@ApiBearerAuth() 
@Controller('api/auth')
export class AgentController { 
    constructor(
        private readonly agentService: AgentService,
        private readonly sendSMSService: SendMessageServiceService,
        private readonly otpService: OtpService,
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
  })  async attributePoints(@Body() infos:{clientId:number, entrepriseId: number, montant:number} ,@Request() request: { user: { caissierId: number }}): Promise<any> {
    const caissierId = request['user'].caissierId;
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
  })  async enleverPoints(@Body() infos:{clientId:number, entrepriseId: number, montant:number} ,@Request() request: { user: { caissierId: number }}): Promise<any> {
    const caissierId = request['user'].caissierId;
    return this.agentService.enleverPoint(caissierId, infos.entrepriseId, infos.clientId, infos.montant);
  }

  @Get('agent/particulier/:id')
  @ApiParam({ name: 'id', description: 'ID du Particulier' })
  async getParticulier(@Param('id') id: number): Promise<any> {
    return this.agentService.getParticulier(id);
  }
}