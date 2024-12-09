import {
    Controller,
    Get,
    Query,
    Put,
    Delete,
    ParseIntPipe,
  } from "@nestjs/common";
  import { RevenueService } from "../revenue/revenue.service";
  @Controller("revenue")
  export class RevenueController {
    constructor(private readonly revenueService: RevenueService) {}
  }