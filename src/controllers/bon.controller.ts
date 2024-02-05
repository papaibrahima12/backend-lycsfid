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
} from '@nestjs/swagger';
import { Region } from 'src/entities/Region.entity';

@Controller('api/v1')
@UseGuards(CompanyGuard)
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
        codeReduction: { type: 'string' },
        reduction: { type: 'string' },
        ageCible: {
          type: 'enum',
          enum: ['10-20ans', '20-30ans', '30-50ans', '50-60ans', '60-plus'],
        },
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
  @ApiBody({ type: Bon, description: 'Données pour mettre à jour un bon' })
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
}
