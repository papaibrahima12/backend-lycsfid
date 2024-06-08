import { AuthGuard } from './../guards/auth/auth.guard';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminService } from 'src/services/admin.service';

@Controller('api/v1')
@ApiTags("Admin Services")
export class AdminController {

    constructor(
        private readonly adminService: AdminService,
    ) {}
    
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get("admin/block/:id")
  async changeStatusCompany(@Param("id") id: number) {
    const result = await this.adminService.changeStatusEntreprise(id);
    return result;
  }
}
