import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

interface Promotion {
  id: number;
  content: string;
  start_date: string;
  end_date: string;
}

@Injectable()
export class PromotionService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllPromotions() {
    try {
      const promotions = await this.prisma.$queryRaw<
        Promotion[]
      >`SELECT * FROM promotion`;

      return promotions.map((promotion) => ({
        ...promotion,
        id: promotion.id.toString(),
      }));
    } catch (error) {
      console.error("Error in getAllPromotions:", error);
      throw new Error("Failed to fetch promotions.");
    }
  }

  async getPromotionByID(promotionID: number) {
    try {
      if (!promotionID || isNaN(promotionID)) {
        throw new Error("Invalid promotion ID");
      }

      const promotion = await this.prisma.$queryRaw<Promotion[]>`
        SELECT 
          id, content, start_date, end_date
        FROM 
          promotion
        WHERE 
          id = ${promotionID}`;

      if (!promotion || promotion.length === 0) {
        throw new Error("No promotion found for this ID.");
      }

      return promotion.map((promotion) => ({
        ...promotion,
        id: promotion.id.toString(),
      }))[0];
    } catch (error) {
      console.error("Error in getPromotionById:", error);
      throw new Error("Failed to fetch promotion.");
    }
  }

  async createPromotion(content: string, start_date: string, end_date: string) {
    try {
      // First, call the stored procedure
      await this.prisma.$executeRawUnsafe(`
        CALL AddNewPromotion('${content}', '${start_date}', '${end_date}',@new_id);
      `);

      // Then, fetch the result from the session variable ---> This can be improved by returning only the newID
      const result = await this.prisma.$queryRaw<Promotion[]>`
        SELECT * from promotion WHERE id = @new_id;
      `;

      // Return the promotion details including the new ID
      return result.map((promotion) => ({
        ...promotion,
        id: promotion.id.toString(),
      }));
    } catch (error) {
      console.error("Error creating promotion:", error);
      throw new Error("Failed to create promotion.");
    }
  }

  async applyPromotion(
    promotionID: number,
    productIDs: number[],
    discountRate: number,
    useCondition: string,
  ) {
    console.log("Promotion ID:", promotionID);
    console.log("Applying promotion to products:", productIDs);
    if (!promotionID || isNaN(promotionID) || productIDs.length === 0) {
      throw new Error("Promotion: Invalid input parameters.");
    }

    const results = await Promise.all(
      productIDs.map(async (productID) => {
        try {
          await this.prisma.$executeRawUnsafe(`
            CALL ApplyPromotion(${productID}, ${promotionID}, ${discountRate}, '${useCondition}');
          `);
          return { productID, status: "success" };
        } catch (error) {
          console.error(
            `Error applying promotion to product ${productID}:`,
            error,
          );
          return { productID, status: "fail", error: error.message };
        }
      }),
    );

    return results;
  }
}
