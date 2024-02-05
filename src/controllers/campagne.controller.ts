import { Body, Controller, Get, Param, Post, Put, UploadedFile, Delete,UseInterceptors, UseGuards, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Campagne } from 'src/entities/Campagne.entity';
import { CompanyGuard } from 'src/guards/company.guard';
import { CampagneService } from 'src/services/campagne.service';


@Controller('api/v1')
@UseGuards(CompanyGuard)
@ApiTags('Campagnes') 
@ApiBearerAuth()
export class CampagneController {
    constructor(private campagneService: CampagneService){}

    @Post('company/campagne/add')
    @UseInterceptors(FileInterceptor('image'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({schema:{ type: 'object',
      properties: {
        nomCampagne: { type: 'string', nullable:false },
        codePromo: { type: 'string' },
        dateDebut: { type: 'string',  format:'date' },
        dateFin: { type: 'string', format:'date' },
        ageCible : {type:'enum',  enum:['10-20ans','20-30ans','30-50ans','50-60ans','60-plus']},
        sexeCible : {type:'enum', enum:['Masculin','Feminin']},
        typeDeCible: { type: 'enum', enum: ['Regions'] },
        localisation: {
        type: 'array',
        items: { type: 'string', enum: ['Dakar', 'Thies', 'Diourbel', 'Fatick', 'Kaffrine', 'Kaolack', 'Kedougou', 'Kolda', 'Louga', 'Matam', 'Saint-Louis', 'Sedhiou', 'Tambacounda', 'Ziguinchor'] },
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },description: 'Données pour créer une campagne' }})
      @ApiBearerAuth() 
    async createCampagne(@Body() campagneData: Campagne,
                         @UploadedFile() file: Express.Multer.File,
                         @Request() request: { user: { userId: number } }): Promise<any> {
        const userId = request['user'].userId;
        return this.campagneService.createCampagne(campagneData, userId,file); 
    }

    @Put('company/campagne/update/:id')
    @UseInterceptors(FileInterceptor('image'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({schema:{ type: 'object',
      properties: {
        nomCampagne: { type: 'string', nullable:false },
        codePromo: { type: 'string' },
        dateDebut: { type: 'string',  format:'date' },
        dateFin: { type: 'string', format:'date' },
        ageCible : {type:'enum',  enum:['10-20ans','20-30ans','30-50ans','50-60ans','60-plus']},
        sexeCible : {type:'enum', enum:['Masculin','Feminin']},
        localisation : {type:'enum', enum:['Dakar','Thies','Diourbel','Fatick','Kaffrine','Kaolack','Kedougou','Kolda','Louga','Matam','Saint-Louis','Sedhiou','Tambacounda','Ziguinchor']},
        image: {
          type: 'string',
          format: 'binary',
        },
      },description: 'Mettre à jour une campagne' }})
    async updateCampagne(
        @Param('id') id: number,
        @Body() campagneData: any, 
        @UploadedFile() file: Express.Multer.File,
    ): Promise<any> {
        return this.campagneService.updateCampagne(id,campagneData,file);
    }

    @Delete('company/campagne/delete/:id')
    @UseInterceptors(FileInterceptor('image'))
    async deleteCampagne(
        @Param('id') id: number): Promise<any> {
        return this.campagneService.deleteCampagne(id);
    }

    @Get('company/campagnes/all')
    async getCampagnes(@Request() request: { user: { userId: number }}): Promise<Campagne[]> {
        const userId = request['user'].userId;
        return this.campagneService.getCampagnes(userId);
    }
}
