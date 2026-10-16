import { SHOP_ITEMS, STARTING_POINTS } from "../data/shop";
import type { ShopCategory, ShopState } from "../types/shop";
const categories: ShopCategory[] = ["avatar", "background", "border"];
export class ShopModel {
    static item(id: string) {
        return SHOP_ITEMS.find((item) => item.id === id);
    }
    static empty(): ShopState {
        return {
            points: STARTING_POINTS,
            ownedIds: [],
            equipped: { avatar: null, background: null, border: null },
        };
    }
    static parse(raw: unknown): ShopState {
        const result = this.empty();
        // Existing app saves have no shop field; give the initial allowance once.
        if (raw === undefined) return result;
        // Corrupt existing balances recover to zero, not a renewed allowance.
        result.points = 0;
        if (!raw || typeof raw !== "object") return result;
        const value = raw as Record<string, unknown>;
        if (
            typeof value.points === "number" &&
            Number.isSafeInteger(value.points) &&
            value.points >= 0
        )
            result.points = value.points;
        if (Array.isArray(value.ownedIds))
            result.ownedIds = [
                ...new Set(
                    value.ownedIds.filter(
                        (id): id is string => typeof id === "string" && !!this.item(id),
                    ),
                ),
            ];
        if (value.equipped && typeof value.equipped === "object") {
            const equipped = value.equipped as Record<string, unknown>;
            for (const category of categories) {
                const id = equipped[category];
                if (
                    typeof id === "string" &&
                    result.ownedIds.includes(id) &&
                    this.item(id)?.category === category
                )
                    result.equipped[category] = id;
            }
        }
        return result;
    }
    static purchase(shop: ShopState, id: string): ShopState {
        const item = this.item(id);
        if (!item) this.fail("This item is not available.");
        if (shop.ownedIds.includes(id)) return shop;
        if (shop.points < item.price) this.fail("Not enough points for this item.");
        return {
            ...shop,
            points: shop.points - item.price,
            ownedIds: [...shop.ownedIds, id],
        };
    }
    static equip(shop: ShopState, id: string): ShopState {
        const item = this.item(id);
        if (!item || !shop.ownedIds.includes(id))
            this.fail("Buy this item before equipping it.");
        return { ...shop, equipped: { ...shop.equipped, [item.category]: id } };
    }
    static unequip(shop: ShopState, category: ShopCategory): ShopState {
        if (!categories.includes(category)) this.fail("Choose a valid category.");
        return { ...shop, equipped: { ...shop.equipped, [category]: null } };
    }
    private static fail(message: string): never {
        const error = new Error(message);
        error.name = "ValidationError";
        throw error;
    }
}
