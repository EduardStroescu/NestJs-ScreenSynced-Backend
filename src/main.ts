import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    //   {
    //   bufferLogs: true,
    // }
  );
  // app.useLogger(app.get(MyLoggerService));

  app.enableCors({
    origin: '*',
  });
  app.setGlobalPrefix('api');
  const PORT = process.env.PORT || 3333;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // const { httpAdapter } = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('ScreenSynced API')
    .setDescription(
      'CRUD API for ScreenSynced - Movies, Series, and TV Shows Streaming',
    )
    .setVersion('1.0')
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('docs', app, document, { useGlobalPrefix: true });

  await app.listen(PORT, () => console.log`"Running on PORT ${PORT}`);
}
bootstrap();
