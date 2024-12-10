import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";

interface Revenue {
  id: number;
  month: number | null;
  year: number | null;
  store_id: number;
  product: {
    id: number;
    name: string;
    variation: {
      size: "S" | "M" | "L" | "D";
      sold_price: number;
      total_quantity_sold: number;
      colors: {
        color: string;
        quantity: number;
      }[];
    }[];
  }[];
}

@Injectable()
export class RevenueService {
  constructor(private readonly prisma: PrismaService) {}

  async getRevenue(
    storeID: number | null,
    month: number | null,
    year: number | null,
  ) {
    try {
      // Build dynamic filters
      let filters = Prisma.sql``;
      if (storeID) {
        filters = Prisma.sql`${filters} AND o.store_id = ${storeID}`;
      }
      if (month) {
        filters = Prisma.sql`${filters} AND MONTH(o.order_date) = ${month}`;
      }
      if (year) {
        filters = Prisma.sql`${filters} AND YEAR(o.order_date) = ${year}`;
      }

      // SQL Query
      const query = Prisma.sql`
        SELECT
          p.id AS productID,
          p.name AS productName,
          pv.size,
          vc.color,
          od.sold_price,
          SUM(od.quantity) AS totalQuantitySold
        FROM 
          product p
        JOIN 
          product_variation pv ON p.id = pv.product_id
        JOIN 
          order_detail od ON pv.id = od.variation_id
        JOIN 
          orders o ON o.id = od.order_id
        JOIN 
          variation_color vc ON pv.id = vc.variation_id
        WHERE 
          o.order_date IS NOT NULL
          ${filters} -- Apply dynamic filters
        GROUP BY 
          p.id, p.name, pv.size, vc.color, od.sold_price
        ORDER BY 
          p.id, pv.size, vc.color;
      `;

      // Execute the query
      const products = await this.prisma.$queryRaw<any[]>(query);

      // Transform results to match the Revenue interface
      const groupedRevenue = products.reduce((acc, product) => {
        const {
          productID,
          productName,
          size,
          color,
          sold_price,
          totalQuantitySold,
        } = product;

        // Find existing product
        let existingProduct = acc.find((rev) => rev.id === productID);
        if (!existingProduct) {
          existingProduct = {
            id: productID,
            name: productName,
            variation: [],
          };
          acc.push(existingProduct);
        }

        // Find existing variation
        let existingVariation = existingProduct.variation.find(
          (v) => v.size === size && v.sold_price === sold_price,
        );
        if (!existingVariation) {
          existingVariation = {
            size: size,
            sold_price: sold_price,
            total_quantity_sold: 0,
            colors: [],
          };
          existingProduct.variation.push(existingVariation);
        }

        // Update total quantity sold for the variation
        existingVariation.total_quantity_sold += parseInt(
          totalQuantitySold,
          10,
        );

        // Add or update color
        const existingColor = existingVariation.colors.find(
          (col) => col.color === color,
        );
        if (existingColor) {
          existingColor.quantity += totalQuantitySold;
        } else {
          existingVariation.colors.push({ color, quantity: totalQuantitySold });
        }

        return acc;
      }, []);

      return groupedRevenue;
    } catch (error) {
      console.error("Error in getRevenue:", error.message);
      return {
        status: "Failed",
        error: "Failed to fetch revenue.",
        message: error.message,
      };
    }
  }
}
