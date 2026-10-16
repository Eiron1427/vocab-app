import { LocalRepository } from "../repositories/local-repository";
import { ShopModel } from "../models/shop";
import { SHOP_ITEMS } from "../data/shop";
import type { ShopCategory } from "../types/shop";
export class ShopService {
    constructor(private readonly repository: LocalRepository) { }
    list(category: ShopCategory) {
        return SHOP_ITEMS.filter((item) => item.category === category);
    }
    buy(id: string): void {
        // Read the current balance and save balance + ownership in the same update.
        this.repository.update((state) => ({
            ...state,
            shop: ShopModel.purchase(state.shop, id),
        }));
    }
    equip(id: string): void {
        this.repository.update((state) => ({
            ...state,
            shop: ShopModel.equip(state.shop, id),
        }));
    }
    unequip(category: ShopCategory): void {
        this.repository.update((state) => ({
            ...state,
            shop: ShopModel.unequip(state.shop, category),
        }));
    }
}
