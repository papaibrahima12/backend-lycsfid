import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { secretKey } from 'src/guards/auth/config';
import { AuthController } from 'src/controllers/auth.controller';
import { AuthService } from 'src/services/auth.service';
import { VerificationService } from 'src/services/verification.service';
import { SendEmailService } from 'src/services/send-email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Verification } from 'src/entities/Verification.entity';
import { Particulier } from 'src/entities/Particulier.entity';
import { Entreprise } from 'src/entities/Entreprise.entity';
import { User } from 'src/entities/User.entity';
import { Session } from 'src/guards/auth/session';

@Module({
    imports: [
    TypeOrmModule.forFeature([User,Entreprise,Particulier,Verification]),
    JwtModule.register({
      secret: secretKey.secret,
      signOptions: { expiresIn: '2h' }, 
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, VerificationService,Session, SendEmailService],
})
export class UserAuthModule {}
