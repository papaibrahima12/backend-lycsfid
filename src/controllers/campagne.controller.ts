import { Body, Controller, Get, Param, Post, Put, UploadedFile, Delete,UseInterceptors, UseGuards, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Campagne } from 'src/entities/Campagne.entity';
import { CompanyGuard } from 'src/guards/company.guard';
import { CampagneService } from 'src/services/campagne.service';


@Controller('api/v1')
@UseGuards(CompanyGuard)
export class CampagneController {
    constructor(private campagneService: CampagneService){}

    @Post('company/campagne/add')
    @UseInterceptors(FileInterceptor('image'))
    async createCampagne(@Body() campagneData: any,
                         @UploadedFile() file: Express.Multer.File,
                         @Request() request: { user: { userId: number } }): Promise<any> {
        const userId = request['user'].userId;
        return this.campagneService.createCampagne(campagneData, userId,file); 
    }

    @Put('company/campagne/update/:id')
    @UseInterceptors(FileInterceptor('image'))
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
