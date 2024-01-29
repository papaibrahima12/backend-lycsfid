import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseGuards,Request, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Bon } from 'src/entities/Bon.entity';
import { CompanyGuard } from 'src/guards/company.guard';
import { BonService } from 'src/services/bon.service';

@Controller('api/v1')
@UseGuards(CompanyGuard)
export class BonController {

    constructor(private bonService: BonService){}

    @Post('company/bon/add')
    @UseInterceptors(FileInterceptor('image'))
    async createBon(@Body() bonData: any,@UploadedFile() file: Express.Multer.File,@Request() request: { user: { userId: number } }): Promise<any> {
        const userId = request['user'].userId;
        return this.bonService.createBon(bonData, userId,file); 
    }

    @Put('company/bon/update/:id')
    @UseInterceptors(FileInterceptor('image'))
    async updateBon(
        @Param('id') id: number,
        @Body() bonData: any, // Remplacez any par le bon modèle approprié
        @UploadedFile() file: Express.Multer.File,
    ): Promise<any> {
        return this.bonService.updateBon(id,bonData,file);
    }

    @Delete('company/bon/delete/:id')
    @UseInterceptors(FileInterceptor('image'))
    async deleteBon(
        @Param('id') id: number): Promise<any> {
        return this.bonService.deleteBon(id);
    }

    @Get('company/bons/all')
    async getUsers(): Promise<Bon[]> {
        return this.bonService.getBons();
    }
}
