import { AgentController } from './../controllers/agent.controller';
import { AgentService } from './../services/agent.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import keyConfig from 'src/config/key.config';
import { Caissier } from 'src/entities/Caissier.entity';
import { Entreprise } from 'src/entities/Entreprise.entity';
import { Historique } from 'src/entities/Historique.entity';
import { Particulier } from 'src/entities/Particulier.entity';
import { PointParEntreprise } from 'src/entities/PointParEntreprise.entity';
import { Program } from 'src/entities/Program.entity';
import { OtpService } from 'src/services/otp.service';
import { SendMessageServiceService } from 'src/services/sendmessageservice.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [keyConfig],
          }),
        TypeOrmModule.forFeature([
            Caissier,
            Program,
            Particulier,
            Entreprise,
            PointParEntreprise,
            Historique
        ]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
              secret: configService.get<string>('key.access'),
              signOptions: { expiresIn: '02h' },
            }),
            inject: [ConfigService],
          }),
    ],
    controllers: [AgentController],
    providers: [AgentService, SendMessageServiceService, OtpService],
})
export class AgentModule { }
