import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { secretKey } from 'src/guards/auth/config';
import { SendEmailService } from 'src/services/send-email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entreprise } from 'src/entities/Entreprise.entity';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, 
        auth: {
          user: 'ibousow311@gmail.com',
          pass: 'mype xtcn zuen isie',
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
    }),
     TypeOrmModule.forFeature([Entreprise]),
    JwtModule.register({
      secret: secretKey.secret,
      signOptions: { expiresIn: '1h' }, 
    }),
  ],
  providers: [SendEmailService],
  exports: [SendEmailService],
})export class MailModule {}
