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

      // Then, fetch the result from the session variable ---> This can be improved by returning only the newID
      const result = await this.prisma.$queryRaw<Promotion[]>`
        SELECT * from promotion WHERE id = @new_id;
      `;

      // Return the promotion details including the new ID
      if (result.length > 0) {
        const promotion = result[0];
        return {
          id: promotion.id.toString(),
          content: promotion.content,
          start_date: promotion.start_date,
          end_date: promotion.end_date,
        };
      } else {
        throw new Error("Failed to retrieve the newly created promotion.");
      }
    } catch (error) {
      console.error("Error creating promotion:", error);
      return {
        status: "Failed",
        message: `Error creating promotion: ${error.message}`,
      };
    }
  }

  async applyPromotion(
    promotionID: number,
    productID: number,
    discountRate: number,
    useCondition: string,
  ) {
    try{
      if (!promotionID || isNaN(promotionID) || !productID || isNaN(productID)) {
        return {
          status: "Failed",
          message: "Error applying promotion: Invalid input parameters.",
        };
      }

      await this.prisma.$executeRawUnsafe(`
        CALL ApplyPromotion(${productID}, ${promotionID}, ${discountRate}, '${useCondition}');
      `);

      return {
        productID,
        promotionID,
        discountRate,
        useCondition,
        status: "success",
        message: `Promotion applied successfully to product ${productID}.`,
      };

    } catch (error){
      return {
        productID,
        status: "fail",
        error: `Error applying promotion to product ${productID}:`,
        message: error.message,
      };
    }
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
    },
  ) {
    try {
      // Begin the dynamic SQL update construction
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
        const updateQuery = `
          UPDATE promotion
          SET ${updateFields.join(", ")}
          WHERE id = ${promotionID};
        `;
        await this.prisma.$executeRawUnsafe(updateQuery);
      }
      
      // Call the AdjustDiscountRateForPromotion stored procedure if discountRate is provided
      if (updates.discountRate !== undefined && updates.discountRate !== null) {
        await this.prisma.$executeRawUnsafe(`
          CALL AdjustDiscountRateForPromotion(${promotionID}, ${updates.discountRate});
        `);
      }
      return {
        status: "Success",
        message: `Promotion ${promotionID} updated successfully.`,
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
