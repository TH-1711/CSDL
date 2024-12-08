import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

(BigInt.prototype as any).toJSON = function () {
  return this.toString(); // Convert BigInt to string
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:3000'], // Allow only requests from this origin
    methods: 'GET,POST,PUT,DELETE',   // Allow specific HTTP methods
    allowedHeaders: 'Content-Type, Authorization', // Allow specific headers
  })

  const port = process.env.PORT ?? 3000;
  app.setGlobalPrefix("api");
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
