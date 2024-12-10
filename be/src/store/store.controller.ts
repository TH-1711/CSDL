import { Controller, Get } from "@nestjs/common";
import { StoreService } from "../store/store.service";

@Controller("store")
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get("storeList")
  async getAllStoreID() {
    return this.storeService.getAllStoreID();
  }
}
