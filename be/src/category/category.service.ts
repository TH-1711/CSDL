import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

interface Category {
  id: number;
  name: string;
}

@Injectable()
export class CategoryService {
  constructor(private readonly categoryService: PrismaService) {}

  async getAllCategory() {
    try {
      const categories = await this.categoryService.$queryRaw<
        Category[]
      >`SELECT * FROM catalog`;

      return categories.map((category) => ({
        ...category,
        id: category.id.toString(), // Convert id to string for serialization
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
      return {
        status: "Failed",
        error: "Failed to fetch categories.",
        message: error.message,
      };
    }
  }

  async productCountByCategory(categoryID: number) {
    try {
      console.log("Input ID:", categoryID); // Log the input to verify it's passed correctly

      const result = await this.categoryService.$queryRaw<
        [{ count: number }]
      >`SELECT CountProductsInCatalog(${categoryID}) AS count`;

      if (result.length > 0) {
        return { count: result[0].count.toString() }; // Convert to string for response
      } else {
        return {
          status: "Failed",
          error: "Category not found.",
          message: "Error in productCountByCategory: Category not found.",
        };
      }
    } catch (error) {
      console.error("Error in productCountByCategory:", error);
      return {
        status: "Failed",
        error: "Failed to fetch product count by category.",
        message: "Error in productCountByCategory.",
      };
    }
  }

  async getCategoryByProduct(productID: number) {
    try {
      console.log("Input ID:", productID); // Log the input to verify it's passed correctly

      const result = await this.categoryService.$queryRaw<
        Category[]
      >`SELECT * FROM catalog WHERE id = (SELECT catalog_id FROM product WHERE id = ${productID})`;

      if (result.length > 0) {
        return result.map((category) => ({
          ...category,
          id: category.id.toString(), // Convert id to string for serialization
        }))[0];
      } else {
        return {
          status: "Failed",
          error: "Category not found.",
          message: "Error in getCategoryByProduct: Category not found.",
        };
      }
    } catch (error) {
      console.error("Error in getCategoryByProduct:", error);
      return {
        status: "Failed",
        error: "Failed to fetch category by product.",
        message: "Error in getCategoryByProduct.",
      };
    }
  }
}
