import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import e from "express";

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
      return {
        status: "Failed",
        message: `Error in getALLPromotions: ${error.message}`,
      };
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
        return {
          status: "Failed",
          message: "Error:Promotion not found.",
        };
      }

      return promotion.map((promotion) => ({
        ...promotion,
        id: promotion.id.toString(),
      }))[0];
    } catch (error) {
      console.error("Error in getPromotionById:", error);
      return {
        status: "Failed",
        message: `Error in getPromotionById: ${error.message}`,
      };
    }
  }

  async createPromotion(content: string, start_date: string, end_date: string) {
    try {
      // First, call the stored procedure
      await this.prisma.$executeRawUnsafe(`
        CALL AddNewPromotion('${content}', '${start_date}', '${end_date}', @new_id);
      `);

      // Then, fetch the result from the session variable
      const result = await this.prisma.$queryRaw<Promotion[]>`
        SELECT * from promotion WHERE id = @new_id;
      `;

      // Return the promotion details including the new ID
      return result.map((promotion) => ({
        ...promotion,
        id: promotion.id.toString(),
      }));
    } catch (error: any) {
      // Extract only the specific message about start_date and end_date
      const detailedMessageMatch = error.message.match(/Message: `(.+?)`/);
      const detailedMessage = detailedMessageMatch
        ? detailedMessageMatch[1]
        : "An unexpected error occurred.";

      console.error("Error creating promotion:", error);
      return {
        status: "Failed",
        message: detailedMessage,
      };
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
      return {
        status: "Failed",
        message: "Error applying promotion: Invalid input parameters.",
      };
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
          return {
            productID,
            status: "fail",
            error: `Error applying promotion to product ${productID}:`,
            message: error.message,
          };
        }
      }),
    );

    return results;
  }

  async deletePromotion(promotionID: number) {
    try {
      // Call the stored procedure
      await this.prisma.$executeRawUnsafe(`
        CALL RemovePromotion(${promotionID});
      `);

      console.log(
        `Promotion with ID ${promotionID} has been deleted successfully.`,
      );

      return {
        success: true,
        message: `Promotion with ID ${promotionID} deleted successfully.`,
      };
    } catch (error) {
      console.error("Error deleting promotion:", error);
      return { success: false, message: "Failed to delete promotion." };
    }
  }

  async updatePromotion(
    promotionID: number,
    updates: {
      content?: string;
      start_date?: string;
      end_date?: string;
      discountRate?: number;
      useCondition?: string;
    },
  ) {
    try {
      // Begin the dynamic SQL update construction for promotion table
      console.log("Updating promotion with ID:", promotionID);
      console.log("Updates:", updates);
      const updateFields: string[] = [];
      if (updates.content) {
        updateFields.push(`content = '${updates.content}'`);
      }
      if (updates.start_date) {
        updateFields.push(`start_date = '${updates.start_date}'`);
      }
      if (updates.end_date) {
        updateFields.push(`end_date = '${updates.end_date}'`);
      }

      if (updateFields.length > 0) {
        const updatePromotionQuery = `
          UPDATE promotion
          SET ${updateFields.join(", ")}
          WHERE id = ${promotionID};
        `;
        await this.prisma.$executeRawUnsafe(updatePromotionQuery);
      }

      // Update promotion_product table
      const updatePromotionProductFields: string[] = [];
      if (updates.discountRate !== undefined && updates.discountRate !== null) {
        updatePromotionProductFields.push(
          `discount_rate = ${updates.discountRate}`,
        );
      }
      if (updates.useCondition) {
        updatePromotionProductFields.push(
          `use_condition = '${updates.useCondition}'`,
        );
      }

      if (updatePromotionProductFields.length > 0) {
        const updatePromotionProductQuery = `
          UPDATE promotion_product
          SET ${updatePromotionProductFields.join(", ")}
          WHERE promotion_id = ${promotionID};
        `;
        await this.prisma.$executeRawUnsafe(updatePromotionProductQuery);
      }

      return {
        status: "Success",
        message: `Promotion ${promotionID} and associated promotion_product records updated successfully.`,
      };
    } catch (error) {
      console.error("Error updating promotion:", error);
      return {
        status: "Failed",
        message: `Error updating promotion: ${error.message}`,
      };
    }
  }
}
