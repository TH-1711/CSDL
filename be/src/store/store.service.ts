import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

interface Store {
  id: number;
  name: string;
}

@Injectable()
export class StoreService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllStoreID() {
    try {
      const stores = await this.prismaService.$queryRaw<
        Store[]
      >`SELECT id, name FROM store`;
      return stores.map((store) => ({
        ...store,
        id: store.id.toString(), // Convert id to string for serialization
      }));
    } catch (error) {
      console.error("Error fetching stores:", error);
      return {
        status: "Failed",
        error: "Failed to fetch store IDs.",
        message: error.message,
      };
    }
  }
}
