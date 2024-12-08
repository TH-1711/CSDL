import { Controller, Get, Query, ParseIntPipe } from "@nestjs/common";
import { CategoryService } from "../category/category.service";

@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAllCategory() {
    return this.categoryService.getAllCategory();
  }

  @Get("productCount")
  async productCountByCategory(
    @Query("categoryID", ParseIntPipe) categoryID: number,
  ) {
    return this.categoryService.productCountByCategory(categoryID);
  }
}
