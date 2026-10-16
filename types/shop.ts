export type ShopCategory = "avatar" | "background" | "border";
export interface ShopItem {
    readonly id: string;
    readonly name: string;
    readonly price: number;
    readonly category: ShopCategory;
    readonly visual: string;
    readonly image?: string;
}
export interface ShopState {
    points: number;
    ownedIds: string[];
    equipped: Record<ShopCategory, string | null>;
}
