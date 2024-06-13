import { AuthGuard } from './../guards/auth/auth.guard';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { StatsCompanies } from 'src/entities/StatsCompanies.entity';
import { AdminService } from 'src/services/admin.service';

@Controller('api/v1')
@UseGuards(AuthGuard)
@ApiTags("Admin Services")
export class AdminController {

    constructor(
        private readonly adminService: AdminService,
    ) {}
    
  @ApiBearerAuth()
  @Get("admin/block/:id")
  async changeStatusCompany(@Param("id") id: number) {
    const result = await this.adminService.changeStatusEntreprise(id);
    return result;
  }

  @Get("admin/statsCompanies")
  @ApiBearerAuth()
  async getStatsAllCompanies(): Promise<StatsCompanies[]> {
    return this.adminService.getAllStatsCompanies();
  }

  @Get("admin/statsActivatedCompanies")
  @ApiBearerAuth()
  async getStatsActivatedCompanies(): Promise<StatsCompanies[]> {
    return this.adminService.getAllStatsActivatedCompanies();
  }

  @Get("admin/statsNewCompanies")
  @ApiBearerAuth()
  async getStatsNewCompanies(): Promise<StatsCompanies[]> {
    return this.adminService.getAllStatsNewCompanies();
  }
}
