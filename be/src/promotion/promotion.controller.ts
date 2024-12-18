import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  Post,
  Body,
  Delete,
  Put,
} from "@nestjs/common";
import { PromotionService } from "./promotion.service";

@Controller("promotion")
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Get()
  async getAllPromotions() {
    return await this.promotionService.getAllPromotions();
  }

  //   @Get("getPromotionByStore")
  //   async getPromotionByStore(@Query("storeID", ParseIntPipe) storeID: number) {
  //     return await this.promotionService.getPromotionByStore(storeID);
  //   }

  @Get("getPromotionByID")
  async getPromotionByID(
    @Query("promotionID", ParseIntPipe) promotionID: number,
  ) {
    if (!promotionID || isNaN(promotionID)) {
      return {
        status: "Failed",
        message: "Invalid promotion ID.",
      };
    }
    return await this.promotionService.getPromotionByID(promotionID);
  }

  @Post("create")
  async createPromotion(
    @Body()
    promotion: {
      content: string;
      start_date: string;
      end_date: string;
    },
  ) {
    const { content, start_date, end_date } = promotion;
    return await this.promotionService.createPromotion(
      content,
      start_date,
      end_date,
    );
  }

  @Post("apply")
  async applyPromotion(
    @Body()
    body: {
      promotionID: number;
      productID: number;
      discountRate: number;
      useCondition: string;
    },
  ) {
    const { promotionID, productID, discountRate, useCondition } = body;
    console.log("input:Promotion ID:", promotionID);
    console.log("input:Applying promotion to products:", productID);
    if (!promotionID || !productID) {
      return { error: "Invalid input parameters." };
    }
    return await this.promotionService.applyPromotion(
      promotionID,
      productID,
      discountRate,
      useCondition,
    );
  }

  @Delete("delete")
  async deletePromotion(
    @Query("promotionID", ParseIntPipe) promotionID: number,
  ) {
    console.log("Input: Promotion ID:", promotionID);

    if (!promotionID || isNaN(promotionID)) {
      return {
        status: "Failed",
        message: "Invalid promotion ID.",
      };
    }

    return await this.promotionService.deletePromotion(promotionID);
  }

  @Put("update")
  async updatePromotion(
    @Body()
    body: {
      promotionID: number;
      updates: {
        content?: string;
        start_date?: string;
        end_date?: string;
        discountRate?: number;
        useCondition?: string;
      };
    },
  ) {
    const { promotionID, updates } = body;
    console.log("Input: Promotion ID:", promotionID);
    return await this.promotionService.updatePromotion(promotionID, updates);
  }
}
