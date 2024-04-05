import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SendEmailService } from 'src/services/send-email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entreprise } from 'src/entities/Entreprise.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import keyConfig from 'src/config/key.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [keyConfig],
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, 
        auth: {
          user: 'ibousow311@gmail.com',
          pass: process.env.mail_password,
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
    }),
     TypeOrmModule.forFeature([Entreprise]),
     JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('key.access'),
        signOptions: { expiresIn: '02h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SendEmailService],
  exports: [SendEmailService],
})export class MailModule {}
