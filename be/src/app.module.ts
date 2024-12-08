import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { PromotionModule } from './promotion/promotion.module';

@Module({
  imports: [CategoryModule, ConfigModule.forRoot({ isGlobal: true }), ProductModule, PromotionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
