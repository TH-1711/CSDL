import { Module } from "@nestjs/common";
import { RevenueService } from "./revenue.service";
import { RevenueController } from "./revenue.controller";
import { PrismaService } from "../prisma/prisma.service"; // Make sure the PrismaService is correctly imported
@Module({
  controllers: [RevenueController],
  providers: [RevenueService, PrismaService],
})
export class RevenueModule {}