import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

interface Category {
  id: number;
  name: string;
}

@Injectable()
export class CategoryService {
  constructor(private readonly categoryService: PrismaService) {}

  async fetchAllCategory() {
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
      throw new Error("Failed to fetch categories.");
    }
  }

  async productCountByCategory(id: number) {
    try {
      console.log("Input ID:", id); // Log the input to verify it's passed correctly

      const result = await this.categoryService.$queryRaw<
        [{ count: number }]
      >`SELECT CountProductsInCatalog(${id}) AS count`;

      if (result.length > 0) {
        return { count: result[0].count.toString() }; // Convert to string for response
      } else {
        throw new Error("No result found for the given ID.");
      }
    } catch (error) {
      console.error("Error in productCountByCategory:", error);
      throw new Error("Failed to fetch product count.");
    }
  }
}
