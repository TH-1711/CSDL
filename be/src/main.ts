import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

(BigInt.prototype as any).toJSON = function () {
  return this.toString(); // Convert BigInt to string
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;
  app.setGlobalPrefix("api");
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
