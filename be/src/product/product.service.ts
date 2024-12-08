import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

interface Product {
  id: number;
  name: string;
  description: string;
  discount_for_employee: number;
  store_id: number;
  store_name: string;
}

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllProducts() {
    try {
      const products = await this.prisma.$queryRaw<
        Product[]
      >`SELECT * FROM product`;

      // Map over the products to transform them if necessary
      return products.map((product) => ({
        ...product,
        id: product.id.toString(), // Convert id to string for serialization
      }));
    } catch (error) {
      console.error("Error in getAllProducts:", error);
      throw new Error("Failed to fetch products.");
    }
  }

  async getProductByCategory(categoryID: number) {
    try {
      // Validate categoryID
      if (!categoryID || isNaN(categoryID)) {
        throw new Error("Invalid category ID");
      }

      // Raw SQL query to fetch products by category
      const products = await this.prisma.$queryRaw<Product[]>`
        SELECT 
          p.id, p.name, p.description, p.discount_for_employee
        FROM 
          product p
        INNER JOIN 
          product_in_catalog pic ON pic.product_id = p.id
        WHERE 
          pic.catalog_id = ${categoryID}`;

      // If no products found, throw an error
      if (!products || products.length === 0) {
        throw new Error("No products found for this category.");
      }

      // Map the results if necessary (e.g., serialize id)
      return products.map((product) => ({
        ...product,
        id: product.id.toString(),
        discount_for_employee: product.discount_for_employee.toString(),
      }));
    } catch (error) {
      console.error("Error in productByCategory:", error.message);
      throw new Error(error.message || "Failed to fetch products by category.");
    }
  }

  async getProductByStore(storeID: number) {
    try {
      const products = await this.prisma.$queryRaw<Product[]>`SELECT 
          p.id, 
          p.name, 
          p.description, 
          p.discount_for_employee,
          s.id AS store_id, 
          s.name AS store_name
        FROM 
          product p
        INNER JOIN 
          product_in_catalog pic ON pic.product_id = p.id
        INNER JOIN 
          catalog c ON c.id = pic.catalog_id
        INNER JOIN
          catalog_in_store cis ON cis.catalog_id = c.id
        INNER JOIN 
          store s ON s.id = cis.store_id
        WHERE 
          s.id = ${storeID}`;

      // Map products to transform data if necessary
      return products.map((product) => ({
        ...product,
        id: product.id.toString(),
        store_id: product.store_id.toString(),
        store_name: product.store_name,
      }));
    } catch (error) {
      console.error("Error in getProductsByStore:", error);
      throw new Error("Failed to fetch products for the store.");
    }
  }

  async getProductByStoreAndCategory(storeID: number, categoryID: number) {
    try {
      const products = await this.prisma.$queryRaw<Product[]>`SELECT 
          p.id, 
          p.name, 
          p.description, 
          p.discount_for_employee,
          s.id AS store_id, 
          s.name AS store_name
        FROM 
          product p
        INNER JOIN 
          product_in_catalog pic ON pic.product_id = p.id
        INNER JOIN 
          catalog c ON c.id = pic.catalog_id
        INNER JOIN
          catalog_in_store cis ON cis.catalog_id = c.id
        INNER JOIN 
          store s ON s.id = cis.store_id
        WHERE 
          s.id = ${storeID} AND c.id = ${categoryID}`;

      // Map products to transform data if necessary
      return products.map((product) => ({
        ...product,
        id: product.id.toString(),
        store_id: product.store_id.toString(),
        store_name: product.store_name,
      }));
    } catch (error) {
      console.error("Error in getProductsByStoreAndCategory:", error);
      throw new Error("Failed to fetch products for the store and category.");
    }
  }
}
