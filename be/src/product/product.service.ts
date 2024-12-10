import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

interface Product {
  id: number;
  name: string;
  description: string;
  discount_for_employee: number;
  catalog_id: number;
  catalog_name: string;
  store_id: string;
  store_name: string;
}

interface ProductVariation {
  id: number;
  origin_price: string;
  sell_price: string;
  size: string;
  product_id: number;
  colors: string | string[] | null;
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
      return {
        status: "Failed",
        error: "Failed to fetch products.",
        message: error.message,
      };
    }
  }

  async getProductByID(productID: number) {
    try {
      // Validate productID
      if (!productID || isNaN(productID)) {
        return {
          status: "Failed",
          message: "Error in getProductByID: Invalid product ID.",
        };
      }

      // Fetch product by ID
      const products = await this.prisma.$queryRaw<Product[]>`
        SELECT 
          p.id, p.name, p.description, p.discount_for_employee
        FROM 
          product p
        WHERE 
          p.id = ${productID}`;

      // If no products found, throw an error
      if (!products || products.length === 0) {
        throw new Error("No products found for this ID.");
      }

      // Map the results if necessary (e.g., serialize id)
      return products.map((product) => ({
        ...product,
        id: product.id.toString(),
        discount_for_employee: product.discount_for_employee.toString(),
      }))[0];
    } catch (error) {
      console.error("Error in getProductByID:", error.message);
      return {
        status: "Failed",
        error: "Failed to fetch product by ID.",
        message: error.message,
      };
    }
  }

  async getProductByCategory(categoryID: number) {
    try {
      // Validate categoryID
      if (!categoryID || isNaN(categoryID)) {
        return {
          status: "Failed",
          message: "Error in getProductByCategory: Invalid category ID.",
        };
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
        categoryID: categoryID.toString(),
      }));
    } catch (error) {
      console.error("Error in productByCategory:", error.message);
      return {
        status: "Failed",
        error: "Failed to fetch products by category.",
        message: error.message,
      };
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
      return {
        status: "Failed",
        error: "Failed to fetch products for the store.",
        message: error.message,
      };
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
        categoryID: categoryID.toString(),
      }));
    } catch (error) {
      console.error("Error in getProductsByStoreAndCategory:", error);
      return {
        status: "Failed",
        error: "Failed to fetch products for the store and category.",
        message: error.message,
      };
    }
  }

  async getVariationByProduct(productID: number) {
    try {
      // Fetch product variations along with their associated colors
      const variations = await this.prisma.$queryRaw<ProductVariation[]>`
        SELECT 
          pv.id, 
          pv.origin_price, 
          pv.sell_price, 
          pv.size, 
          pv.product_id, 
          GROUP_CONCAT(vc.color) AS colors
        FROM 
          product_variation pv
        LEFT JOIN 
          variation_color vc ON pv.id = vc.variation_id
        WHERE 
          pv.product_id = ${productID}
        GROUP BY 
          pv.id, pv.origin_price, pv.sell_price, pv.size, pv.product_id`;

      // Transform data
      return variations.map((variation) => ({
        ...variation,
        id: variation.id.toString(),
        origin_price: variation.origin_price,
        sell_price: variation.sell_price,
        size: variation.size,
        product_id: variation.product_id.toString(),
        colors: Array.isArray(variation.colors)
          ? variation.colors
          : variation.colors
            ? variation.colors.split(",")
            : [],
      }));
    } catch (error) {
      console.error("Error in getVariationByProductID:", error.message);
      return {
        status: "Failed",
        error: "Failed to fetch product variations.",
        message: error.message,
      };
    }
  }

  async getVariationByProductAndStore(productID: number, storeID: number) {
    try {
      // Fetch variations with their colors and quantities in the given store
      const variations = await this.prisma.$queryRaw<any[]>`
        SELECT 
          v.id AS variationID,
          v.product_id AS productID,
          vs.store_id AS storeID,
          v.size,
          v.origin_price,
          v.sell_price,
          vc.color,
          vs.quantity
        FROM 
          product_variation v
        INNER JOIN 
          variation_in_store vs ON v.id = vs.variation_id
        INNER JOIN 
          variation_color vc ON v.id = vc.variation_id AND vc.color = vs.color
        WHERE 
          v.product_id = ${productID} AND vs.store_id = ${storeID}
      `;

      // Group variations by variationID
      const groupedVariations = variations.reduce((acc, curr) => {
        const {
          variationID,
          productID,
          storeID,
          size,
          origin_price,
          sell_price,
          color,
          quantity,
        } = curr;

        if (!acc[variationID]) {
          acc[variationID] = {
            variationID,
            productID,
            storeID,
            size,
            origin_price,
            sell_price,
            colors: [],
          };
        }

        acc[variationID].colors.push({ color, quantity });

        return acc;
      }, {});

      // Return as an array
      return Object.values(groupedVariations);
    } catch (error) {
      console.error("Error in getVariationByProductAndStore:", error.message);
      return {
        status: "Failed",
        error: "Failed to fetch variations by product and store.",
        message: error.message,
      };
    }
  }

  async createProduct(
    catalogID: number,
    name: string,
    description: string,
    discountForEmployee: number,
  ) {
    try {
      // Sử dụng Prisma để truyền tham số an toàn
      console.log(
        "Creating product:",
        catalogID,
        name,
        description,
        discountForEmployee,
      );
      await this.prisma.$executeRawUnsafe(
        `
        CALL AddProduct(?, ?, ?, ?, @new_product_id);
      `,
        catalogID,
        name,
        description,
        discountForEmployee,
      );

      // Lấy giá trị từ biến session
      const result = await this.prisma.$queryRaw<Product[]>`
        SELECT * FROM product WHERE id = (SELECT @new_product_id);
      `;

      if (!result || result.length === 0) {
        return {
          status: "Failed",
          message: "Error in addProduct: Product not added.",
        };
      }

      const product = result[0];

      return {
        status: "Success",
        productID: product.id,
      };
    } catch (error) {
      console.error("Error in addProduct:", error.message);
      return {
        status: "Failed",
        message: "Error in addProduct: " + error.message,
      };
    }
  }

  async createVariation(
    productId: number,
    originPrice: number,
    size: "S" | "M" | "L" | "D",
  ) {
    try {
      // Call the stored procedure to insert a product variation
      await this.prisma.$executeRawUnsafe<any[]>(`
        CALL insertProductVariation(${productId}, ${originPrice}, '${size}'COLLATE utf8mb4_unicode_ci , @new_variation_id);
      `);

      // Fetch the result from the session variable
      const result = await this.prisma.$queryRaw<ProductVariation>`
        SELECT * from product_variation WHERE id = @new_variation_id COLLATE utf8mb4_unicode_ci;
      `;
      console.log("Result:", result);
      const variation = result[0];
      if (!variation || !variation.id) {
        throw new Error("Failed to retrieve the new variation ID.");
      }

      return { status: "Success", ...variation };
    } catch (error) {
      console.error("Error in insertProductVariation:", error.message);
      return {
        status: "Failed",
        message: "Error in insertProductVariation: " + error.message,
      };
    }
  }
}
