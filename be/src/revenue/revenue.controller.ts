import {
  Controller,
  Get,
  Query,
  Put,
  Delete,
  ParseIntPipe,
  Body,
} from "@nestjs/common";
import { RevenueService } from "../revenue/revenue.service";

@Controller("revenue")
export class RevenueController {
  constructor(private readonly revenueService: RevenueService) {}
  @Get("get")
  async getRevenue(
    @Query("storeID") storeID: number | null,
    @Query("month") month: number | null,
    @Query("year") year: number | null,
  ) {
    return await this.revenueService.getRevenue(storeID, month, year);
  }
}
