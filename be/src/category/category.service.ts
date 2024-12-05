import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface Category {
  id: number;
  name: string;
}

@Injectable()
export class CategoryService {
  constructor(private readonly categoryService: PrismaService) {}

  async getAllCategories() {
    // Fetch categories using raw SQL
    const categories = await this.categoryService.$queryRaw<
      Category[]
    >`SELECT * FROM catalog`;

    // Now you can safely use .map() because TypeScript knows the result is of type Category[]
    return categories.map((category) => ({
      ...category,
      id: category.id.toString(), // Convert id to string for serialization
    }));
  }
}
