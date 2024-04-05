import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as dotenv from 'dotenv';
import * as process from 'process';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as passport from 'passport';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  dotenv.config();
  // app.use(cookieParser());
  // app.use(
  //     session({
  //       secret: "0a6b944d-d2fb-46fc-a85e-0295c986cd9fJKAJKLFAfsuiwegnvjkesdjeknsd",
  //       resave: false,
  //       saveUninitialized: false,
  //     })
  //   );
  // app.use(passport.initialize())
  // app.use(passport.session())
  const options = new DocumentBuilder()
    .setTitle('Api Production LYCS FID')
    .setDescription('')
    .setVersion('1.0')
    .addServer('http://localhost:3000/', 'Local environment')
    .addServer('https://fidelycs-backend.duckdns.org/', 'Production')
    .addTag('Backend Fidelycs')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          message: error.constraints[Object.keys(error.constraints)[0]],
        }));
        return new BadRequestException(result);
      },
      stopAtFirstError: true,
    }),
  );
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
