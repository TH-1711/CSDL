import { Module } from "@nestjs/common";
import { CategoryModule } from "./category/category.module";
import { ConfigModule } from "@nestjs/config";
import { ProductModule } from "./product/product.module";
import { PromotionModule } from "./promotion/promotion.module";
import { RevenueModule } from "./revenue/revenue.module";
import { StoreModule } from './store/store.module';

@Module({
  imports: [
    CategoryModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ProductModule,
    PromotionModule,
    RevenueModule,
    StoreModule,
  ],
})
export class AppModule {}
