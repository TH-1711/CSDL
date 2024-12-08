import { Controller, Get, Query } from "@nestjs/common";
import { CategoryService } from "../category/category.service";

@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async fetchAllCategory() {
    return this.categoryService.fetchAllCategory();
  }

  @Get("productCount")
  async productCountByCategory(@Query("id") id: number) {
    return this.categoryService.productCountByCategory(id);
  }
}
