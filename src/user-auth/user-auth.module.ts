import { AdminService } from 'src/services/admin.service';
import { Campagne } from 'src/entities/Campagne.entity';
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { AuthController } from 'src/controllers/auth.controller';
import { AuthService } from 'src/services/auth.service';
import { VerificationService } from 'src/services/verification.service';
import { SendEmailService } from 'src/services/send-email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Verification } from 'src/entities/Verification.entity';
import { Particulier } from 'src/entities/Particulier.entity';
import { Entreprise } from 'src/entities/Entreprise.entity';
import { User } from 'src/entities/User.entity';
import { Session } from 'src/guards/auth/session.serializer';
import { PassportModule } from '@nestjs/passport';
import { Bon } from 'src/entities/Bon.entity';
import { Caissier } from 'src/entities/Caissier.entity';
import { SendMessageServiceService } from 'src/services/sendmessageservice.service';
import { OtpService } from 'src/services/otp.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import keyConfig from 'src/config/key.config';
import { AdminModule } from 'src/modules/admin.module';
import { StatsBon } from 'src/entities/StatsBon.entity';
import { StatsCamp } from 'src/entities/StatsCamp.entity';
import { StatsCompanies } from 'src/entities/StatsCompanies.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [keyConfig],
    }),
    PassportModule,
    AdminModule,
    TypeOrmModule.forFeature([
      User,
      Entreprise,
      StatsBon,
      StatsCamp,
      StatsCompanies,
      Particulier,
      Bon,
      Caissier,
      Campagne,
      Verification,
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('key.access'),
        signOptions: { expiresIn: '06h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,OtpService, AdminService, VerificationService,SendMessageServiceService, Session, SendEmailService],
})
export class UserAuthModule {}
