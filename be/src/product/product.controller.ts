import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  Post,
  Delete,
  Body,
} from "@nestjs/common";
import { ProductService } from "./product.service";

@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProduct() {
    return await this.productService.getAllProducts();
  }

  @Get("getProductByCategory")
  async getProductByCategory(
    @Query("categoryID", ParseIntPipe) categoryID: number,
  ) {
    return await this.productService.getProductByCategory(categoryID);
  }

  @Get("getProductByStore")
  async getProductByStore(@Query("storeID", ParseIntPipe) storeID: number) {
    return await this.productService.getProductByStore(storeID);
  }

  @Get("getProductByStoreAndCategory")
  async getProductByStoreAndCategory(
    @Query("storeID", ParseIntPipe) storeID: number,
    @Query("categoryID", ParseIntPipe) categoryID: number,
  ) {
    return await this.productService.getProductByStoreAndCategory(
      storeID,
      categoryID,
    );
  }

  @Get("getVariationByProduct")
  async getVariationByProduct(
    @Query("productID", ParseIntPipe) productID: number,
  ) {
    return await this.productService.getVariationByProduct(productID);
  }

  @Get("getProductByID")
  async getProductByID(@Query("productID", ParseIntPipe) productID: number) {
    return await this.productService.getProductByID(productID);
  }

  @Get("getVariationByProductAndStore")
  async getVariationByProductAndStore(
    @Query("productID", ParseIntPipe) productID: number,
    @Query("storeID", ParseIntPipe) storeID: number,
  ) {
    return await this.productService.getVariationByProductAndStore(
      productID,
      storeID,
    );
  }

  @Post("create")
  async createProduct(
    @Body()
    product: {
      categoryID: number;
      name: string;
      description: string;
      discountForEmployee: number;
    },
  ) {
    const { categoryID, name, description, discountForEmployee } = product;
    return await this.productService.createProduct(
      categoryID,
      name,
      description,
      discountForEmployee,
    );
  }

  @Post("createVariation")
  async createVariation(
    @Body()
    variation: {
      productID: number;
      originPrice: number;
      size: "S" | "M" | "L" | "D";
    },
  ) {
    const { productID, originPrice, size } = variation;
    return await this.productService.createVariation(
      productID,
      originPrice,
      size,
    );
  }
}
