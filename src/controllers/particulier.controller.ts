import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Bon } from 'src/entities/Bon.entity';
import { ParticulierGuard } from 'src/guards/particulier.guard';
import { ParticulierService } from 'src/services/particulier.service';


@Controller('api/v1')
@ApiTags('Particuliers')
export class ParticulierController {
      constructor(private particulierService: ParticulierService) {}

  @Get('particulier/bons/all')
  @UseGuards(ParticulierGuard)
  @ApiQuery({ name: 'page', description: 'Numéro de page', required: false })
  @ApiQuery({
    name: 'limit',
    description: "Limite d'éléments par page",
    required: false,
  })
  async getBons(): Promise<Bon[]> {
    return this.particulierService.getBons();
  }
}
