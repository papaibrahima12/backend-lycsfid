import { SendMessageServiceService } from './services/sendmessageservice.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserAuthModule } from './user-auth/user-auth.module';
import { MailModule } from './mailer/mailer.module';
import { FileModuleModule } from './file-module/file-module.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticulierModule } from './modules/particulier.module';
import { EntrepriseModule } from './modules/entreprise.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'pgadmin.cxlgttvw2fl6.us-east-1.rds.amazonaws.com',
      port: 5432,
      password: process.env.PASSWORD,
      username: 'ibrahima',
      entities: [],
      autoLoadEntities: true,
      database: 'lycsallio',
      synchronize: true,
      logging: true,
    }),
    UserAuthModule,
    MailModule,
    FileModuleModule,
    ParticulierModule,
    EntrepriseModule
  ],
  controllers: [AppController],
  providers: [SendMessageServiceService, AppService],
})
export class AppModule { }
