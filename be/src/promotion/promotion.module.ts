import { Module } from "@nestjs/common";
import { PromotionService } from "./promotion.service";
import { PromotionController } from "./promotion.controller";
import { PrismaService } from "../prisma/prisma.service"; // Make sure the PrismaService is correctly imported

@Module({
  controllers: [PromotionController],
  providers: [PromotionService, PrismaService],
})
export class PromotionModule {}
