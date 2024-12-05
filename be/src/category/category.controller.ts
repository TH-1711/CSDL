import { Controller, Get } from '@nestjs/common';
import { CategoryService } from '../category/category.service';

@Controller('category') // Route chính là /api/category
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll() {
    return this.categoryService.getAllCategories();
  }
}
