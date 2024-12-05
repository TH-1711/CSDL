import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface Product {
  id: number;
  name: string;
}

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllProducts() {
    const products = await this.prisma.$queryRaw<
      Product[]
    >`SELECT * FROM product`;

    // Now you can safely use .map() because TypeScript knows the result is of type Category[]
    return products.map((product) => ({
      ...product,
      id: product.id.toString(), // Convert id to string for serialization
    }));
  }
}
