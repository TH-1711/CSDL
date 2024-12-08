import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  Post,
  Body,
} from "@nestjs/common";
import { PromotionService } from "./promotion.service";

@Controller("promotion")
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  //   @Get()
  //   async getAllPromotion() {
  //     return await this.promotionService.getAllPromotion();
  //   }

  //   @Get("getPromotionByStore")
  //   async getPromotionByStore(@Query("storeID", ParseIntPipe) storeID: number) {
  //     return await this.promotionService.getPromotionByStore(storeID);
  //   }

  @Get("getPromotionByID")
  async getPromotionByID(
    @Query("promotionID", ParseIntPipe) promotionID: number,
  ) {
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

  //   @Post("apply")
  //   async applyPromotion(
  //     @Body()
  //     promotion: {
  //       promotionID: number;
  //       productID: number;
  //     },
  //   ) {
  //     const { promotionID, productID } = promotion;
  //     return await this.promotionService.applyPromotion(promotionID, productID);
  //   }
}
