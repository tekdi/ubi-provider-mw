import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { config } from "dotenv";
import * as Sentry from "@sentry/node";
import { join } from "path";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as bodyParser from 'body-parser';

config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Sentry.init({
  //   dsn: 'YOUR_SENTRY_DSN_HERE', // Replace with your actual Sentry DSN
  // });
  // app.use(Sentry.Handlers.requestHandler());
  // app.use(Sentry.Handlers.errorHandler());

  app.setViewEngine("ejs");
  app.setBaseViewsDir(join("src", ".", "views"));
  app.enableCors();

  // Increase the request body size limit
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(
    bodyParser.urlencoded({
      limit: '50mb',
      extended: true,
    }),
  );

  await app.listen(4000);
}
bootstrap();
