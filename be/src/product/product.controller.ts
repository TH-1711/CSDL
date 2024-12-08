import { Controller, Get, Query } from "@nestjs/common";
import { ProductService } from "./product.service";

@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProduct() {
    return await this.productService.getAllProducts();
  }

  @Get("productByCategory")
  async getProductByCategory(@Query("categoryID") categoryID: number) {
    return await this.productService.getProductByCategory(categoryID);
  }

  @Get("productByStore")
  async getProductByStore(@Query("storeID") storeID: number) {
    return await this.productService.getProductByStore(storeID);
  }
}
