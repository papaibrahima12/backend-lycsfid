import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Bon } from 'src/entities/Bon.entity';
import { CompanyGuard } from 'src/guards/company.guard';
import { BonService } from 'src/services/bon.service';
import {
  ApiTags,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiConsumes,
  ApiBearerAuth,
} from '@nestjs/swagger';



@Controller('api/v1')
@UseGuards(CompanyGuard)
@ApiBearerAuth() 
@ApiTags('bons')
export class BonController {
  constructor(private bonService: BonService) {}

  @Post('company/bon/add')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nomBon: { type: 'string', nullable: false },
        dateDebut: { type: 'string', format: 'date' },
        dateFin: { type: 'string', format: 'date' },
        typeBon: { type: 'string' },
        typeReduction: { type: 'enum', enum: ['montant', 'pourcentage'] },
        reduction: { type: 'string' },
        ageCibleMin: { type: 'integer', nullable:true },
        ageCibleMax: { type: 'integer', nullable:true },
        sexeCible: { type: 'enum', enum: ['Masculin', 'Feminin'] },
        typeDeCible: { type: 'enum', enum: ['Regions'] },
        localisation: {
        type: 'array',
        items: { type: 'string', enum: ['Dakar', 'Thies', 'Diourbel', 'Fatick', 'Kaffrine', 'Kaolack', 'Kedougou', 'Kolda', 'Louga', 'Matam', 'Saint-Louis', 'Sedhiou', 'Tambacounda', 'Ziguinchor'] },
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
      description: 'Données pour créer un bon',
    },
  })
  async createBon(
    @Body() bonData: Bon,
    @UploadedFile() file: Express.Multer.File,
    @Request() request: { user: { userId: number } },
  ): Promise<any> {
    const userId = request['user'].userId;
    return this.bonService.createBon(bonData, userId, file);
  }

  @Put('company/bon/update/:id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({schema:{ type: 'object',
      properties: {
        nomBon: { type: 'string', nullable:false },
        dateDebut: { type: 'string',  format:'date' },
        dateFin: { type: 'string', format:'date' },
        typeBon: { type: 'string' },
        typeReduction: { type: 'string' },
        reduction: { type: 'string' },
        ageCibleMin: { type: 'integer', nullable:true },
        ageCibleMax: { type: 'integer', nullable:true },
        sexeCible : {type:'enum', enum:['Masculin','Feminin']},
        localisation : {type:'enum', enum:['Dakar','Thies','Diourbel','Fatick','Kaffrine','Kaolack','Kedougou','Kolda','Louga','Matam','Saint-Louis','Sedhiou','Tambacounda','Ziguinchor']},
        image: {
          type: 'string',
          format: 'binary',
        },
      },description: 'Mettre à jour un bon' }})
  @ApiParam({ name: 'id', description: 'ID du bon à mettre à jour' })
  async updateBon(
    @Param('id') id: number,
    @Body() bonData: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    return this.bonService.updateBon(id, bonData, file);
  }

  @Delete('company/bon/delete/:id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiParam({ name: 'id', description: 'ID du bon à supprimer' })
  async deleteBon(@Param('id') id: number): Promise<any> {
    return this.bonService.deleteBon(id);
  }

  @Get('company/bons/all')
  @ApiQuery({ name: 'page', description: 'Numéro de page', required: false })
  @ApiQuery({
    name: 'limit',
    description: "Limite d'éléments par page",
    required: false,
  })
  async getBons(
    @Request() request: { user: { userId: number } },
  ): Promise<Bon[]> {
    const userId = request['user'].userId;
    return this.bonService.getBons(userId);
  }

  @Get('company/bon/activate/:id')
  @ApiParam({ name: 'id', description: 'ID du bon à activer' })
  async activateBon(@Param('id') id: number, @Request() request: { user: { userId: number }}): Promise<any> {
    const userId = request['user'].userId;
    return this.bonService.activateBon(id,userId);
  }


}
