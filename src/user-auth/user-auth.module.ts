import { Campagne } from 'src/entities/Campagne.entity';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { secretKey } from 'src/config/config';
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

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([
      User,
      Entreprise,
      Particulier,
      Bon,
      Caissier,
      Campagne,
      Verification,
    ]),
    JwtModule.register({
      secret: secretKey.secret,
      signOptions: { expiresIn: '02h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,OtpService,VerificationService,SendMessageServiceService, Session, SendEmailService],
})
export class UserAuthModule {}
