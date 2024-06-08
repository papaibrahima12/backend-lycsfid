import { UserAuthModule } from './../user-auth/user-auth.module';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entreprise } from 'src/entities/Entreprise.entity';
import { AdminController } from 'src/controllers/admin.controller';
import { AdminService } from 'src/services/admin.service';
import { AuthController } from 'src/controllers/auth.controller';
import { AuthService } from 'src/services/auth.service';
import { User } from 'src/entities/User.entity';
import { Particulier } from 'src/entities/Particulier.entity';

@Module({
     imports: [
    TypeOrmModule.forFeature([Entreprise]),
  ],
  controllers: [AdminController],
  providers: [AdminService, JwtService],
})
export class AdminModule {}
