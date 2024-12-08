import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

interface Revenue {
  id: number;
  name: string;
}

@Injectable()
export class RevenueService {
  constructor(private readonly prisma: PrismaService) {}
}
